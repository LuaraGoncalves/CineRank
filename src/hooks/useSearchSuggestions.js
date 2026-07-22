import { useEffect, useState } from 'react';

const DEFAULT_MIN_SEARCH_LENGTH = 1;
const DEFAULT_SEARCH_DEBOUNCE_MS = 250;

export function useSearchSuggestions(
  query,
  searchFn,
  {
    minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
    debounceMs = DEFAULT_SEARCH_DEBOUNCE_MS
  } = {}
) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    let isCurrentSearch = true;
    const trimmedQuery = query.trim();

    const delayDebounceFn = setTimeout(async () => {
      if (trimmedQuery.length >= minSearchLength) {
        setIsSearching(true);
        const data = await searchFn(trimmedQuery);
        if (!isCurrentSearch) return;
        setResults(data);
        setIsSearching(false);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
        setIsSearching(false);
      }
    }, debounceMs);

    return () => {
      isCurrentSearch = false;
      clearTimeout(delayDebounceFn);
    };
  }, [debounceMs, minSearchLength, query, searchFn]);

  return {
    results,
    isSearching,
    showResults,
    setShowResults,
    minSearchLength
  };
}
