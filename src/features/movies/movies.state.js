import { createStore } from '../../core/store.js';

const initialState = {
    currentType: 'movie',
    currentPage: 1,
    isLoading: false,
    totalPages: 1,
    moviesList: [],
    error: false,
    isAppending: false,
    genres: [],
    trailers: [],
    searchQuery: '',
    searchParams: {
        genre: '',
        year: '',
        rating: ''
    }
};

const store = createStore(initialState);

export const subscribe = store.subscribe;
export const getState = store.getState;
export const setState = store.setState;
export function resetPage() {
    store.setState({ currentPage: 1, isAppending: false });
}

export function nextPage() {
    const state = store.getState();
    if (state.currentPage < state.totalPages) {
        store.setState({ currentPage: state.currentPage + 1, isAppending: true });
        return true;
    }
    return false;
}