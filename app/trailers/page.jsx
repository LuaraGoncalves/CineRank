"use client";

import { useState, useEffect } from 'react';
import { fetchTrendingTrailers } from '../actions';

const INITIAL_VISIBLE_TRAILERS = 6;
const TRAILERS_PER_LOAD = 3;

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TRAILERS);

  useEffect(() => {
    const loadTrailers = async () => {
      setLoading(true);
      setVisibleCount(INITIAL_VISIBLE_TRAILERS);
      const data = await fetchTrendingTrailers(query);
      setTrailers(data);
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      loadTrailers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const visibleTrailers = trailers.slice(0, visibleCount);
  const hasMoreTrailers = visibleCount < trailers.length;

  return (
    <section id="trailers" aria-labelledby="trailers-title" className="page-section trailers-page">
      <h2 id="trailers-title" className="page-title">Trailers em Destaque</h2>
      <div className="search-container active trailer-search-box" role="search" aria-label="Busca de trailers">
        <input 
          type="text" 
          id="trailer-search-input" 
          placeholder="Pesquisar por filme..." 
          aria-label="Pesquisar trailers"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          id="trailer-search-button" 
          aria-label="Botão de pesquisa de trailers"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>

      {loading ? (
        <div className="loading-panel">
          <div className="spinner"></div>
        </div>
      ) : trailers.length > 0 ? (
        <>
          <div className="trailer-grid">
            {visibleTrailers.map((trailer) => (
              <div key={trailer.id} className="trailer-card">
                <div className="trailer-embed">
                  <iframe 
                    className="trailer-iframe"
                    src={`https://www.youtube.com/embed/${trailer.key}`} 
                    title={trailer.name} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="trailer-card-body">
                  <h3 className="trailer-card-title">{trailer.movieTitle}</h3>
                  <p className="trailer-card-name">{trailer.name}</p>
                </div>
              </div>
            ))}
          </div>

          {hasMoreTrailers && (
            <div className="trailer-actions">
              <button
                type="button"
                className="notification-more-button trailer-more-button"
                onClick={() => setVisibleCount(prev => prev + TRAILERS_PER_LOAD)}
              >
                Ver mais
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state-panel">
          <p>Nenhum trailer encontrado.</p>
        </div>
      )}
    </section>
  );
}
