'use client';

import { useState, useEffect } from 'react';
import FeedbackState from '../components/FeedbackState';
import { fetchTrendingTrailersResult } from '../actions';
import { SERVICE_STATUS } from '../../src/services/service-result.js';

const INITIAL_VISIBLE_TRAILERS = 6;
const TRAILERS_PER_LOAD = 3;

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TRAILERS);

  useEffect(() => {
    const loadTrailers = async () => {
      setLoading(true);
      setError(null);
      setErrorStatus(null);
      setVisibleCount(INITIAL_VISIBLE_TRAILERS);
      const result = await fetchTrendingTrailersResult(query);
      setTrailers(result.data);
      setError(result.error);
      setErrorStatus(result.status);
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      loadTrailers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, reloadKey]);

  const visibleTrailers = trailers.slice(0, visibleCount);
  const hasMoreTrailers = visibleCount < trailers.length;
  const errorVariant =
    errorStatus === SERVICE_STATUS.MISSING_CONFIG ? 'warning' : 'error';

  return (
    <section
      id="trailers"
      aria-labelledby="trailers-title"
      className="page-section trailers-page"
    >
      <h2 id="trailers-title" className="page-title">
        Trailers em Destaque
      </h2>
      <div
        className="search-container active trailer-search-box"
        role="search"
        aria-label="Busca de trailers"
      >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search icon"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>

      {loading ? (
        <FeedbackState
          variant="loading"
          title="Carregando trailers"
          message="Estamos buscando vídeos recentes no catálogo."
        />
      ) : error ? (
        <FeedbackState
          variant={errorVariant}
          title={
            errorStatus === SERVICE_STATUS.MISSING_CONFIG
              ? 'Configuração necessária'
              : 'Não conseguimos carregar os trailers'
          }
          message={error}
          actionLabel="Tentar novamente"
          onAction={() => setReloadKey((currentKey) => currentKey + 1)}
        />
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
                onClick={() =>
                  setVisibleCount((prev) => prev + TRAILERS_PER_LOAD)
                }
              >
                Ver mais
              </button>
            </div>
          )}
        </>
      ) : (
        <FeedbackState
          title="Nenhum trailer encontrado"
          message="Tente pesquisar outro filme ou limpar o campo de busca."
        />
      )}
    </section>
  );
}
