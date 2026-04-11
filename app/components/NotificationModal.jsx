"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchNews } from '../actions';

export default function NotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
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
      
      const lastSeen = localStorage.getItem('cinerank_last_news');
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
      localStorage.setItem('cinerank_last_news', new Date().toISOString());
    }
  };

  return (
    <div className="notification-container" style={{ position: 'relative' }} ref={containerRef}>
      <button 
        id="notification-bell" 
        className="notification-bell" 
        aria-label="Visualizar notificações e notícias" 
        tabIndex="0" 
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}
        onClick={handleOpen}
      >
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-ring icon"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
        {hasUnread && (
          <span style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: 'red', borderRadius: '50%' }}></span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '350px',
          maxHeight: '400px',
          background: 'var(--card-bg)',
          border: '1px solid #444',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '1rem',
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #444', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Últimas Notícias</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}>&times;</button>
          </div>
          
          {loading ? (
            <p style={{ textAlign: 'center' }}>Buscando notícias...</p>
          ) : news.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {news.map((article, i) => (
                <div key={i} style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                  <a href={article.url} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>
                    {article.title}
                  </a>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>{article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}</p>
                  <p style={{ fontSize: '0.9rem' }}>{article.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center' }}>Nenhuma notícia encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
