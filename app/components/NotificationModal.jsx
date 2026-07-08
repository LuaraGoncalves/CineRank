"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchNews } from '../actions';
import { StorageService } from '../../src/core/storage.js';

export default function NotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [hasUnread, setHasUnread] = useState(false);
  const [translations, setTranslations] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const articles = await fetchNews();
      setNews(articles);
      
      const lastSeen = StorageService.getLastSeenNewsDate();
      if (articles.length > 0) {
        if (!lastSeen || new Date(articles[0].publishedAt) > new Date(lastSeen)) {
          setHasUnread(true);
        }
      }
      setLoading(false);
    }
    loadNews();
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
      StorageService.setLastSeenNewsDate(new Date().toISOString());
    }
  };

  const handleTranslate = async (index, title, description) => {
    if (translations[index]?.loading || translations[index]?.title) return;

    setTranslations(prev => ({ ...prev, [index]: { loading: true } }));

    try {
      const translateText = async (text) => {
        if (!text) return text;
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(text)}`);
        if (!res.ok) {
          throw new Error('Falha ao traduzir notícia');
        }
        const data = await res.json();
        return data[0].map(item => item[0]).join('');
      };

      const translateWithRetry = async (text) => {
        try {
          return await translateText(text);
        } catch (firstError) {
          console.warn('Tentando traduzir novamente...', firstError);
          return await translateText(text);
        }
      };

      const [translatedTitle, translatedDescription] = await Promise.all([
        translateWithRetry(title),
        translateWithRetry(description)
      ]);

      setTranslations(prev => ({
        ...prev,
        [index]: {
          title: translatedTitle,
          description: translatedDescription,
          loading: false
        }
      }));
    } catch (error) {
      console.error("Erro ao traduzir:", error);
      setTranslations(prev => ({ ...prev, [index]: { loading: false, error: true } }));
    }
  };

  return (
    <div className="notification-container" ref={containerRef}>
      <button 
        id="notification-bell" 
        className="notification-bell" 
        aria-label="Visualizar notificações e notícias" 
        tabIndex="0" 
        onClick={handleOpen}
      >
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-ring icon"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
        {hasUnread && (
          <span className="notification-unread-dot"></span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <h3 className="notification-panel-title">Últimas Notícias</h3>
            <button className="notification-close-button" onClick={() => setIsOpen(false)}>&times;</button>
          </div>
          
          {loading ? (
            <p className="notification-state">Buscando notícias...</p>
          ) : news.length > 0 ? (
            <div className="notification-list">
              {news.slice(0, visibleCount).map((article, i) => {
                return (
                  <div key={i} className="notification-item">
                    <div className="notification-item-header">
                      <a href={article.url} target="_blank" rel="noreferrer" className="notification-link">
                        {translations[i]?.title || article.title}
                      </a>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleTranslate(i, article.title, article.description); }}
                        title={translations[i]?.error ? "Tentar traduzir novamente" : "Traduzir notícia"} 
                        aria-label={translations[i]?.error ? "Tentar traduzir notícia novamente" : "Traduzir notícia"}
                        disabled={translations[i]?.loading || translations[i]?.title}
                        className={`notification-translate-button ${translations[i]?.title ? 'is-translated' : ''} ${translations[i]?.error ? 'is-error' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                      </button>
                    </div>
                    <p className="notification-meta">{article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}</p>
                    <p className="notification-description">{translations[i]?.description || article.description}</p>
                  </div>
                );
              })}
              {visibleCount < news.length && (
                <div className="notification-actions">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  className="notification-more-button"
                >
                  Ver mais
                </button>
                </div>
              )}
            </div>
          ) : (
            <p className="notification-state">Nenhuma notícia encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
