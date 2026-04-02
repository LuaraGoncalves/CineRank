import { STORAGE_KEYS } from './constants.js';

export const StorageService = {
    getWatchlist: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST)) || [],
    
    addToWatchlist: (item, currentType) => {
        const watchlist = StorageService.getWatchlist();
        const itemToSave = { ...item, media_type: item.media_type || currentType };
        watchlist.push(itemToSave);
        localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    },

    removeFromWatchlist: (itemId) => {
        let watchlist = StorageService.getWatchlist();
        watchlist = watchlist.filter(item => item.id !== itemId);
        localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    },

    isInWatchlist: (itemId) => {
        return StorageService.getWatchlist().some(item => item.id === itemId);
    },

    getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME),
    setTheme: (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme),

    getHighScore: () => localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || 0,
    setHighScore: (score) => localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score),

    getLastSeenNewsDate: () => localStorage.getItem(STORAGE_KEYS.LAST_SEEN_NEWS),
    setLastSeenNewsDate: (dateStr) => localStorage.setItem(STORAGE_KEYS.LAST_SEEN_NEWS, dateStr),

    getSearchHistory: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)) || [],
    addSearchHistory: (query) => {
        if (!query.trim()) return;
        let history = StorageService.getSearchHistory();
        
        history = history.filter(q => q.toLowerCase() !== query.toLowerCase());
        history.unshift(query);
        
        if (history.length > 5) history = history.slice(0, 5);
        localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
    }
};
