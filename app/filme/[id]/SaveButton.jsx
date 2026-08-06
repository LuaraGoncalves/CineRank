'use client';

import { useState, useEffect } from 'react';
import { logger } from '../../../src/core/logger.js';
import { WatchlistRepository } from '../../../src/repositories/watchlist.repository.js';

export default function SaveButton({ movie }) {
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSavedState() {
      const saved = await WatchlistRepository.isSaved(movie.id);
      if (!isMounted) return;
      setIsSaved(saved);
      setLoading(false);
    }

    loadSavedState();

    return () => {
      isMounted = false;
    };
  }, [movie.id]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    const currentType = movie.media_type || (movie.title ? 'movie' : 'tv');

    try {
      const result = await WatchlistRepository.toggle(movie, currentType);

      setIsSaved(result.isSaved);
      if (result.isSaved) {
        showToast('Adicionado aos favoritos!');
      } else {
        showToast('Removido dos favoritos!');
      }
    } catch (error) {
      showToast('Erro ao salvar no dispositivo');
      logger.error('Watchlist_Toggle_Failed', error, {
        movieId: movie.id
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="save-button-wrapper">
      <button
        onClick={handleSave}
        disabled={loading}
        title={isSaved ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className={`save-button ${isSaved ? 'is-saved' : ''}`}
      >
        {isSaved ? (
          <>
            <svg
              className="save-button-icon-saved"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            Remover
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            Favoritar
          </>
        )}
      </button>

      {toastMessage && <div className="save-toast">{toastMessage}</div>}
    </div>
  );
}
