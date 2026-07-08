'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchMulti } from '../actions';

export default function SearchBox() {
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

  const openSearch = () => {
    setIsSearchActive((prev) => !prev);
    if (!isSearchActive) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const openResult = (item) => {
    setShowResults(false);
    setQuery('');
    router.push(`/filme/${item.id}?type=${item.media_type}`);
  };

  return (
    <div
      className={`search-container ${isSearchActive ? 'active' : ''}`}
      id="main-search-container"
      ref={searchRef}
    >
      <input
        type="text"
        id="search-input"
        placeholder="Pesquisar..."
        aria-label="Pesquisar"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (query.trim().length > 2) setShowResults(true);
        }}
      />
      <button id="search-button" aria-label="Pesquisar" onClick={openSearch}>
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
        <div className="search-results-dropdown">
          {isSearching ? (
            <div className="search-results-state">Buscando...</div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <button
                type="button"
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
            <div className="search-results-state">
              Nenhum resultado encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
