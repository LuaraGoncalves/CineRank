'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from './MovieCard';
import CustomSelect from './CustomSelect';
import SkeletonCard from './SkeletonCard';
import { fetchFilteredMovies, fetchGenres } from '../actions';

export default function Dashboard({ initialMovies }) {
  const initialMovieCount = initialMovies?.length || 0;
  const [movies, setMovies] = useState(initialMovies || []);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const hasMountedRef = useRef(false);
  const observer = useRef();

  const [filters, setFilters] = useState({
    type: 'movie',
    genre: 'all',
    year: 'all',
    rating: 'all'
  });

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function loadGenres() {
      if (filters.type === 'all') {
        setGenres([]);
        return;
      }
      try {
        const data = await fetchGenres(filters.type);
        setGenres(data);
      } catch {
        setGenres([]);
      }
    }
    loadGenres();
  }, [filters.type]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (initialMovieCount === 0) {
        setLoading(true);
        setPage(1);
        fetchFilteredMovies({ ...filters, page: 1 })
          .then((data) => {
            setMovies(data);
            setHasMore(data.length > 0);
          })
          .finally(() => setLoading(false));
      }
      return;
    }

    async function loadInitialMovies() {
      try {
        setLoading(true);
        setPage(1); // reseta pagina
        const data = await fetchFilteredMovies({ ...filters, page: 1 });
        setMovies(data);
        setHasMore(data.length > 0);
      } finally {
        setLoading(false);
      }
    }

    loadInitialMovies();
  }, [filters, initialMovieCount]);

  useEffect(() => {
    if (page === 1) return; // a primeira pagina carrega no filtro

    async function loadMoreMovies() {
      try {
        setLoadingMore(true);
        const data = await fetchFilteredMovies({ ...filters, page });
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setMovies((prev) => {
            // Remove duplicates se a API retornar os mesmos itens
            const newMovies = data.filter(
              (d) => !prev.some((p) => p.id === d.id)
            );
            return [...prev, ...newMovies];
          });
        }
      } finally {
        setLoadingMore(false);
      }
    }

    loadMoreMovies();
  }, [page, filters]);

  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { genre: 'all' } : {})
    }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(50), (val, index) => currentYear - index);

  return (
    <section id="dashboard" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title">CineRank</h1>
      <div
        className="filter-container dashboard-filters"
        role="search"
        aria-label="Filtros de conteúdo"
      >
        <CustomSelect
          value={filters.type}
          onChange={(val) =>
            handleFilterChange({ target: { name: 'type', value: val } })
          }
          options={[
            { value: 'all', label: 'Filmes e Séries' },
            { value: 'movie', label: 'Filmes' },
            { value: 'tv', label: 'Séries' }
          ]}
        />

        <CustomSelect
          disabled={filters.type === 'all'}
          value={filters.genre}
          onChange={(val) =>
            handleFilterChange({ target: { name: 'genre', value: val } })
          }
          options={[
            { value: 'all', label: 'Gênero' },
            ...genres.map((g) => ({ value: g.id.toString(), label: g.name }))
          ]}
        />

        <CustomSelect
          disabled={filters.type === 'all'}
          value={filters.year}
          onChange={(val) =>
            handleFilterChange({ target: { name: 'year', value: val } })
          }
          options={[
            { value: 'all', label: 'Ano' },
            ...years.map((y) => ({ value: y.toString(), label: y.toString() }))
          ]}
        />

        <CustomSelect
          disabled={filters.type === 'all'}
          value={filters.rating}
          onChange={(val) =>
            handleFilterChange({ target: { name: 'rating', value: val } })
          }
          options={[
            { value: 'all', label: 'Classificação' },
            { value: '8', label: '8+' },
            { value: '7', label: '7+' },
            { value: '6', label: '6+' },
            { value: '5', label: '5+' }
          ]}
        />
      </div>

      <div
        id="movie-container"
        className="movie-container"
        role="region"
        aria-label="Lista de Filmes e Séries Encontrados"
        aria-live="polite"
      >
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
        ) : movies.length > 0 ? (
          <>
            {movies.map((movie, index) => {
              if (movies.length === index + 1) {
                return (
                  <div ref={lastMovieElementRef} key={`${movie.id}-${index}`}>
                    <MovieCard movie={movie} />
                  </div>
                );
              }
              return <MovieCard key={`${movie.id}-${index}`} movie={movie} />;
            })}

            {/* Exibe Skeletons extras no final durante o Infinite Scroll */}
            {loadingMore &&
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={`skel-${i}`} />
              ))}
          </>
        ) : (
          <p className="empty-state-text">
            Nenhum filme encontrado para os filtros selecionados.
          </p>
        )}
      </div>
    </section>
  );
}
