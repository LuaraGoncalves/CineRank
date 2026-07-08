import { STORAGE_KEYS } from './constants.js';

function safeParseJSON(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getFirstStoredValue(keys) {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value !== null && value !== undefined) {
      return value;
    }
  }
  return null;
}

export const StorageService = {
  getWatchlist: () =>
    safeParseJSON(
      getFirstStoredValue([
        STORAGE_KEYS.WATCHLIST,
        'cinerank_watchlist',
        'watchlist'
      ]),
      []
    ),

  addToWatchlist: (item, currentType) => {
    if (typeof localStorage === 'undefined') return;
    const watchlist = StorageService.getWatchlist();
    const itemToSave = { ...item, media_type: item.media_type || currentType };
    const nextWatchlist = watchlist.filter(
      (saved) => saved.id !== itemToSave.id
    );
    nextWatchlist.push(itemToSave);
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(nextWatchlist));
  },

  removeFromWatchlist: (itemId) => {
    let watchlist = StorageService.getWatchlist();
    watchlist = watchlist.filter((item) => item.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  },

  isInWatchlist: (itemId) => {
    return StorageService.getWatchlist().some((item) => item.id === itemId);
  },

  getTheme: () =>
    getFirstStoredValue([STORAGE_KEYS.THEME, 'cinerank_theme', 'theme']),
  setTheme: (theme) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getHighScore: () =>
    Number(getFirstStoredValue([STORAGE_KEYS.HIGH_SCORE, 'highScore']) || 0),
  setHighScore: (score) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(score));
  },

  getLastSeenNewsDate: () =>
    getFirstStoredValue([
      STORAGE_KEYS.LAST_SEEN_NEWS,
      'cinerank_last_news',
      'lastSeenNewsDate'
    ]),
  setLastSeenNewsDate: (dateStr) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LAST_SEEN_NEWS, dateStr);
  },

  getSearchHistory: () =>
    safeParseJSON(
      getFirstStoredValue([STORAGE_KEYS.SEARCH_HISTORY, 'searchHistory']),
      []
    ),
  addSearchHistory: (query) => {
    if (typeof localStorage === 'undefined') return;
    if (!query.trim()) return;
    let history = StorageService.getSearchHistory();

    history = history.filter((q) => q.toLowerCase() !== query.toLowerCase());
    history.unshift(query);

    if (history.length > 5) history = history.slice(0, 5);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
  }
};
