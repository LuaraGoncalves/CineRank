"use client";

import { useState, useEffect } from 'react';
import { fetchTrendingTrailers } from '../actions';

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrailers = async () => {
      setLoading(true);
      const data = await fetchTrendingTrailers(query);
      setTrailers(data);
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      loadTrailers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <section id="trailers" aria-labelledby="trailers-title" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 id="trailers-title" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Trailers em Destaque</h2>
      <div className="search-container active trailer-search-box" role="search" aria-label="Busca de trailers" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          id="trailer-search-input" 
          placeholder="Pesquisar por filme..." 
          aria-label="Pesquisar trailers"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '0.8rem 1rem',
            background: 'var(--card-bg)',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'var(--text-color)',
            maxWidth: '400px'
          }}
        />
        <button 
          id="trailer-search-button" 
          aria-label="Botão de pesquisa de trailers"
          style={{
            padding: '0.8rem',
            background: 'var(--primary-color)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--text-color)',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
        </div>
      ) : trailers.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {trailers.map((trailer) => (
            <div key={trailer.id} style={{ background: 'var(--card-bg)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={`https://www.youtube.com/embed/${trailer.key}`} 
                  title={trailer.name} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--primary-color)' }}>{trailer.movieTitle}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trailer.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
          <p>Nenhum trailer encontrado.</p>
        </div>
      )}
    </section>
  );
}
