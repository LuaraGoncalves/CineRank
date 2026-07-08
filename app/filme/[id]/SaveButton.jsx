"use client";

import { useState, useEffect } from 'react';
import { StorageService } from '../../../src/core/storage.js';

export default function SaveButton({ movie }) {
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setIsSaved(StorageService.isInWatchlist(movie.id));
    setLoading(false);
  }, [movie.id]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleSave = () => {
    setLoading(true);
    const currentType = movie.media_type || (movie.title ? 'movie' : 'tv');
    
    const movieData = {
      id: movie.id,
      title: movie.title || null,
      name: movie.name || null,
      poster_path: movie.poster_path || null,
      vote_average: movie.vote_average || null,
      release_date: movie.release_date || null,
      first_air_date: movie.first_air_date || null,
    };
    
    try {
      const exists = StorageService.isInWatchlist(movie.id);
      let isAdded = false;

      if (exists) {
        StorageService.removeFromWatchlist(movie.id);
      } else {
        StorageService.addToWatchlist(movieData, currentType);
        isAdded = true;
      }

      setIsSaved(isAdded);
      if (isAdded) {
        showToast('Adicionado aos favoritos!');
      } else {
        showToast('Removido dos favoritos!');
      }
    } catch (error) {
      showToast('Erro ao salvar no dispositivo');
      console.error(error);
    }
    
    setLoading(false);
  };

  return (
    <div className="save-button-wrapper">
      <button 
        onClick={handleSave}
        disabled={loading}
        title={isSaved ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className={`save-button ${isSaved ? 'is-saved' : ''}`}
      >
        {isSaved ? (
          <>
            <svg className="save-button-icon-saved" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            Remover
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            Favoritar
          </>
        )}
      </button>

      {toastMessage && (
        <div className="save-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
