"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import NotificationModal from './NotificationModal';
import { searchMulti } from '../actions';
import { useRouter } from 'next/navigation';
import { StorageService } from '../../src/core/storage.js';

export default function Header() {
  const [theme, setTheme] = useState('dark');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsSearchActive(false);
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
    const savedTheme = StorageService.getTheme() || 'dark';
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
    StorageService.setTheme(newTheme);
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
        <div className={`search-container ${isSearchActive ? 'active' : ''}`} id="main-search-container" ref={searchRef}>
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
          <button 
            id="search-button" 
            aria-label="Pesquisar" 
            onClick={() => {
              setIsSearchActive(!isSearchActive);
              if (!isSearchActive) {
                setTimeout(() => document.getElementById('search-input')?.focus(), 100);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          
          {showResults && (
            <div className="search-results-dropdown">
              {isSearching ? (
                <div className="search-results-state">Buscando...</div>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <button
                    type="button"
                    key={item.id} 
                    onClick={() => {
                      setShowResults(false);
                      setQuery('');
                      router.push(`/filme/${item.id}?type=${item.media_type}`);
                    }}
                    className="search-result-item"
                  >
                    {item.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                        alt={item.title || item.name} 
                        className="search-result-poster"
                      />
                    ) : (
                      <div className="search-result-poster-placeholder"></div>
                    )}
                    <div>
                      <div className="search-result-title">{item.title || item.name}</div>
                      <div className="search-result-meta">
                        {item.media_type === 'movie' ? 'Filme' : 'Série'}
                        {item.release_date ? ` • ${item.release_date.substring(0, 4)}` : ''}
                        {item.first_air_date ? ` • ${item.first_air_date.substring(0, 4)}` : ''}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="search-results-state">Nenhum resultado encontrado.</div>
              )}
            </div>
          )}
        </div>
        <button id="theme-toggle" aria-label="Alternar modo de cor" aria-pressed={theme === 'light'} onClick={toggleTheme}>
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
