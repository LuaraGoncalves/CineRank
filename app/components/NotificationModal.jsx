'use client';

import { useCallback, useEffect, useRef } from 'react';
import { fetchNewsResult } from '../actions';
import FeedbackState from './FeedbackState';
import {
  NEWS_TIME_ZONE,
  useNotifications
} from '../../src/hooks/useNotifications.js';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export default function NotificationModal() {
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const bellButtonRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const {
    isOpen,
    setIsOpen,
    news,
    loading,
    error,
    visibleCount,
    hasUnread,
    translations,
    handleOpen,
    handleTranslate,
    reloadNews,
    showMore
  } = useNotifications(fetchNewsResult);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeModal();
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeModal]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElementRef.current = document.activeElement;
    const fallbackFocusedElement = bellButtonRef.current;
    const firstFocusableElement =
      panelRef.current?.querySelector(FOCUSABLE_SELECTOR);

    firstFocusableElement?.focus();

    return () => {
      const previousElement = previouslyFocusedElementRef.current;
      if (previousElement instanceof HTMLElement) {
        previousElement.focus();
      } else {
        fallbackFocusedElement?.focus();
      }
    };
  }, [isOpen]);

  const handlePanelKeyDown = (event) => {
    if (event.key !== 'Tab' || !panelRef.current) return;

    const focusableElements = Array.from(
      panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
    ).filter((element) => element.offsetParent !== null);

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div className="notification-container" ref={containerRef}>
      <button
        ref={bellButtonRef}
        id="notification-bell"
        className="notification-bell"
        aria-label="Visualizar notificações e notícias"
        aria-controls="notification-panel"
        aria-expanded={isOpen}
        tabIndex="0"
        onClick={handleOpen}
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bell-ring icon"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          <path d="M4 2C2.8 3.7 2 5.7 2 8" />
          <path d="M22 8c0-2.3-.8-4.3-2-6" />
        </svg>
        {hasUnread && <span className="notification-unread-dot"></span>}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="notification-panel"
          id="notification-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-panel-title"
          onKeyDown={handlePanelKeyDown}
        >
          <div className="notification-panel-header">
            <h3
              className="notification-panel-title"
              id="notification-panel-title"
            >
              Últimas Notícias
            </h3>
            <button
              type="button"
              className="notification-close-button"
              aria-label="Fechar notificações"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>

          {loading ? (
            <FeedbackState
              variant="loading"
              title="Buscando notícias"
              message="Estamos consultando as fontes mais recentes."
              compact
            />
          ) : error ? (
            <FeedbackState
              variant="error"
              title="Notícias indisponíveis"
              message={error}
              actionLabel="Tentar novamente"
              onAction={reloadNews}
              compact
            />
          ) : news.length > 0 ? (
            <div className="notification-list">
              {news.slice(0, visibleCount).map((article, i) => {
                return (
                  <div key={i} className="notification-item">
                    <div className="notification-item-header">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="notification-link"
                      >
                        {translations[i]?.title || article.title}
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTranslate(
                            i,
                            article.title,
                            article.description
                          );
                        }}
                        title={
                          translations[i]?.error
                            ? 'Tentar traduzir novamente'
                            : 'Traduzir notícia'
                        }
                        aria-label={
                          translations[i]?.error
                            ? 'Tentar traduzir notícia novamente'
                            : 'Traduzir notícia'
                        }
                        disabled={
                          translations[i]?.loading || translations[i]?.title
                        }
                        className={`notification-translate-button ${translations[i]?.title ? 'is-translated' : ''} ${translations[i]?.error ? 'is-error' : ''}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          <path d="M2 12h20" />
                        </svg>
                      </button>
                    </div>
                    <p className="notification-meta">
                      {article.source.name} -{' '}
                      {new Date(article.publishedAt).toLocaleString('pt-BR', {
                        timeZone: NEWS_TIME_ZONE,
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </p>
                    <p className="notification-description">
                      {translations[i]?.description || article.description}
                    </p>
                    {translations[i]?.loading && (
                      <p className="notification-translation-state">
                        Traduzindo notícia...
                      </p>
                    )}
                    {translations[i]?.error && (
                      <p className="notification-translation-state is-error">
                        Não foi possível traduzir. Tente novamente pelo botão.
                      </p>
                    )}
                  </div>
                );
              })}
              {visibleCount < news.length && (
                <div className="notification-actions">
                  <button
                    type="button"
                    onClick={showMore}
                    className="notification-more-button"
                  >
                    Ver mais
                  </button>
                </div>
              )}
            </div>
          ) : (
            <FeedbackState
              title="Nenhuma notícia encontrada"
              message="Assim que novas notícias forem encontradas, elas aparecem aqui."
              compact
            />
          )}
        </div>
      )}
    </div>
  );
}
