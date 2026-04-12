"use client";

import { useState, useEffect } from 'react';
import { toggleWatchlist, getWatchlist } from '../../actions';

export default function SaveButton({ movie }) {
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function checkWatchlist() {
      const watchlist = await getWatchlist();
      setIsSaved(watchlist.some(m => m.id === movie.id));
      setLoading(false);
    }
    checkWatchlist();
  }, [movie.id]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    
    const movieData = {
      id: movie.id,
      title: movie.title,
      name: movie.name,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      first_air_date: movie.first_air_date,
    };
    const result = await toggleWatchlist(movieData);
    
    if (result.success) {
      setIsSaved(result.isAdded);
      if (result.isAdded) {
        showToast('Adicionado aos favoritos!');
      } else {
        showToast('Removido dos favoritos!');
      }
    } else {
      showToast('Erro ao salvar.');
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={handleSave}
        disabled={loading}
        title={isSaved ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.6rem 1.2rem', 
          background: isSaved ? 'rgba(255, 255, 255, 0.1)' : 'var(--primary-color)', 
          color: isSaved ? 'var(--text-light)' : 'var(--text-color)', 
          border: isSaved ? '1px solid #444' : '1px solid var(--primary-color)', 
          borderRadius: '20px', 
          cursor: loading ? 'wait' : 'pointer', 
          fontWeight: '500', 
          fontSize: '0.9rem', 
          transition: 'all 0.2s',
          opacity: loading ? 0.7 : 1
        }}
      >
        {isSaved ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
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
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '10px',
          padding: '8px 12px',
          background: 'var(--card-bg)',
          color: 'var(--text-color)',
          border: '1px solid #444',
          borderRadius: '4px',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
