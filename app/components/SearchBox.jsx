'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchMulti } from '../actions';
import { useSearchSuggestions } from '../../src/hooks/useSearchSuggestions.js';

const MIN_SEARCH_LENGTH = 1;
const SEARCH_DEBOUNCE_MS = 250;

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const { results, isSearching, showResults, setShowResults, minSearchLength } =
    useSearchSuggestions(query, searchMulti, {
      minSearchLength: MIN_SEARCH_LENGTH,
      debounceMs: SEARCH_DEBOUNCE_MS
    });

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsSearchActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowResults]);

  const openSearch = () => {
    setIsSearchActive((prev) => !prev);
    if (!isSearchActive) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const openResult = (item) => {
    setShowResults(false);
    setQuery('');
    router.push(`/filme/${item.id}?type=${item.media_type}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowResults(false);
      setIsSearchActive(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={`search-container ${isSearchActive ? 'active' : ''}`}
      id="main-search-container"
      ref={searchRef}
    >
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        id="search-input"
        placeholder="Pesquisar..."
        aria-label="Pesquisar"
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-expanded={showResults}
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.trim().length >= minSearchLength) setShowResults(true);
        }}
      />
      <button
        id="search-button"
        type="button"
        aria-label="Pesquisar"
        aria-controls="search-input"
        aria-expanded={isSearchActive}
        onClick={openSearch}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search icon"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {showResults && (
        <div
          className="search-results-dropdown"
          id="search-results"
          role="listbox"
          aria-label="Sugestões de busca"
        >
          {isSearching ? (
            <div className="search-results-state" role="status">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <button
                type="button"
                role="option"
                aria-selected="false"
                key={`${item.media_type}-${item.id}`}
                onClick={() => openResult(item)}
                className="search-result-item"
              >
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                    alt={item.title || item.name}
                    width={40}
                    height={60}
                    className="search-result-poster"
                  />
                ) : (
                  <div className="search-result-poster-placeholder"></div>
                )}
                <div>
                  <div className="search-result-title">
                    {item.title || item.name}
                  </div>
                  <div className="search-result-meta">
                    {item.media_type === 'movie' ? 'Filme' : 'Série'}
                    {item.release_date
                      ? ` • ${item.release_date.substring(0, 4)}`
                      : ''}
                    {item.first_air_date
                      ? ` • ${item.first_air_date.substring(0, 4)}`
                      : ''}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="search-results-state" role="status">
              Nenhum resultado encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
