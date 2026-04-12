"use client";

import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cinerank_watchlist');
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {
        console.error('Erro ao parsear watchlist', e);
      }
    }
    setLoading(false);
  }, []);

  return (
    <section id="watchlist" aria-labelledby="watchlist-title" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 id="watchlist-title" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Minha Lista de Favoritos</h2>
      <div id="watchlist-container" className="movie-container" role="region" aria-live="polite">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : watchlist.length > 0 ? (
          watchlist.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-light)' }}>
            Sua lista está vazia. Adicione filmes e séries para vê-los aqui!
          </p>
        )}
      </div>
    </section>
  );
}
