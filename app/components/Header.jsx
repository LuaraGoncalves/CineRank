"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import NotificationModal from './NotificationModal';

export default function Header() {
  const [theme, setTheme] = useState('dark');

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
        <div className="search-container" id="main-search-container" style={{ position: 'relative' }}>
          <input type="text" id="search-input" placeholder="Pesquisar..." aria-label="Pesquisar" autoComplete="off" />
          <button id="search-button" aria-label="Pesquisar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
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
