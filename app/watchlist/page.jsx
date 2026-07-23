'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import { WatchlistRepository } from '../../src/repositories/watchlist.repository.js';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadWatchlist() {
      const savedItems = await WatchlistRepository.getAll();
      if (!isMounted) return;
      setWatchlist(savedItems);
      setLoading(false);
    }

    loadWatchlist();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="watchlist"
      aria-labelledby="watchlist-title"
      className="page-section watchlist-page"
    >
      <h2 id="watchlist-title" className="page-title">
        Minha Lista de Favoritos
      </h2>
      <div
        id="watchlist-container"
        className="movie-container"
        role="region"
        aria-live="polite"
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : watchlist.length > 0 ? (
          watchlist.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="empty-state-text empty-state-text-padded">
            Sua lista está vazia. Adicione filmes e séries para vê-los aqui!
          </p>
        )}
      </div>
    </section>
  );
}
