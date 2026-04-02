import { TmdbAPI } from '../../services/tmdb.service.js';
import { TmdbAdapter } from '../../services/tmdb.adapter.js';
import { getState, setState, resetPage } from './movies.state.js';

export const MoviesController = {
    async fetchMovies() {
        const state = getState();
        if (state.isLoading) return;
        
        setState({ isLoading: true, error: false });

        try {
            const data = await TmdbAPI.fetchContent(
                state.currentPage, 
                state.currentType, 
                state.searchQuery, 
                state.searchParams.genre, 
                state.searchParams.year, 
                state.searchParams.rating
            );
            
            const validResults = data.results
                .filter(item => item.media_type !== 'person')
                .map(item => {
                    const defaultType = state.currentType === 'all' ? 'movie' : state.currentType;
                    return TmdbAdapter.adaptMovie(item, defaultType);
                });
            
            setState({ 
                totalPages: data.total_pages,
                moviesList: state.currentPage === 1 ? validResults : [...state.moviesList, ...validResults]
            });
            
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            setState({ error: true });
        } finally {
            setState({ isLoading: false });
        }
    },

    async fetchTrailers(query = '') {
        try {
            const trailers = await TmdbAPI.fetchTrendingTrailers(query);
            setState({ trailers });
        } catch (error) {
            console.error('Erro ao carregar trailers:', error);
            setState({ trailers: [] });
        }
    },

    async fetchGenres() {
        try {
            const state = getState();
            const data = await TmdbAPI.fetchGenres(state.currentType);
            setState({ genres: data });
        } catch (error) {
            console.error('Erro ao carregar gêneros:', error);
            setState({ genres: [] });
        }
    },

    updateSearchParams(params) {
        const currentState = getState();
        setState({
            searchParams: { ...currentState.searchParams, ...params }
        });
        resetPage();
        this.fetchMovies();
    },

    updateSearchQuery(query) {
        setState({ searchQuery: query });
        resetPage();
        this.fetchMovies();
    },

    updateType(type) {
        setState({ currentType: type, searchQuery: '' });
        resetPage();
        this.fetchGenres();
        this.fetchMovies();
    },
    
    loadNextPage() {
        import('./movies.state.js').then(({ nextPage }) => {
            if (nextPage()) {
                this.fetchMovies();
            }
        });
    }
};