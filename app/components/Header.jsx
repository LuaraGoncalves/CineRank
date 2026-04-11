"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import NotificationModal from './NotificationModal';
import { searchMulti } from '../actions';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [theme, setTheme] = useState('dark');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        const data = await searchMulti(query);
        setResults(data);
        setIsSearching(false);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cinerank_theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('cinerank_theme', newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  return (
    <header>
      <nav aria-label="Menu de Navegação Principal">
        <Link href="/" aria-label="Ir para Início">Inicio</Link>
        <Link href="/watchlist" aria-label="Ir para Minha Lista de Favoritos">Minha Lista</Link>
        <Link href="/quiz" aria-label="Ir para o Quiz Interativo">Quiz</Link>
        <Link href="/trailers" aria-label="Ir para a sessão de Trailers em Destaque">Trailers</Link>
      </nav>
      <div className="header-actions">
        <div className="search-container" id="main-search-container" style={{ position: 'relative' }} ref={searchRef}>
          <input 
            type="text" 
            id="search-input" 
            placeholder="Pesquisar..." 
            aria-label="Pesquisar" 
            autoComplete="off" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length > 2) setShowResults(true);
            }}
          />
          <button id="search-button" aria-label="Pesquisar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          
          {showResults && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--card-bg)',
              border: '1px solid #444',
              borderRadius: '4px',
              marginTop: '5px',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {isSearching ? (
                <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-light)' }}>Buscando...</div>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setShowResults(false);
                      setQuery('');
                      router.push(`/filme/${item.id}?type=${item.media_type}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      borderBottom: '1px solid #333',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {item.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                        alt={item.title || item.name} 
                        style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '60px', background: '#333', borderRadius: '4px' }}></div>
                    )}
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.title || item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        {item.media_type === 'movie' ? 'Filme' : 'Série'}
                        {item.release_date ? ` • ${item.release_date.substring(0, 4)}` : ''}
                        {item.first_air_date ? ` • ${item.first_air_date.substring(0, 4)}` : ''}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-light)' }}>Nenhum resultado encontrado.</div>
              )}
            </div>
          )}
        </div>
        <button id="theme-toggle" aria-label="Alternar modo de cor" aria-pressed="false" tabIndex="0" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon icon theme-icon moon-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          ) : (
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun icon theme-icon sun-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          )}
        </button>
        <NotificationModal />
      </div>
    </header>
  );
}
