"use client";

import { useState } from 'react';
import { toggleWatchlist } from '../../actions';

export default function SaveButton({ movie }) {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const result = await toggleWatchlist(movie);
    setLoading(false);
    
    if (result.success) {
      if (result.isAdded) {
        alert('Adicionado à sua Lista (Sincronizado no Servidor)!');
      } else {
        alert('Removido da sua Lista!');
      }
    } else {
      alert('Erro ao salvar na lista.');
    }
  };

  return (
    <button 
      onClick={handleSave}
      disabled={loading}
      style={{ 
        padding: '0.8rem 1.5rem', 
        background: 'var(--primary-color)', 
        color: 'var(--text-color)', 
        border: '1px solid var(--text-color)', 
        borderRadius: '4px', 
        cursor: loading ? 'wait' : 'pointer', 
        fontWeight: 'bold', 
        fontSize: '1rem', 
        width: 'fit-content',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? 'Salvando...' : 'Adicionar / Remover da Lista'}
    </button>
  );
}
