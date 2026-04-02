import { UI } from '../core/ui.js';
import { StorageService } from '../core/storage.js';
import { MoviesController } from '../features/movies/movies.controller.js';
import { MoviesView } from '../features/movies/movies.view.js';
import { Router } from './router.js';
import { subscribe } from '../features/movies/movies.state.js';
import { MoviesEvents } from '../features/movies/movies.events.js';
import { http } from '../core/http.js';
import { handleError } from '../core/errors.js';

http.interceptors.response.use(
    response => response,
    error => {
        handleError(error);
        throw error;
    }
);

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const mainSearchContainer = document.getElementById('main-search-container');
    const searchHistoryDropdown = document.getElementById('search-history-dropdown');
    const movieContainer = document.getElementById('movie-container');
    const typeFilter = document.getElementById('type-filter');
    const genreFilter = document.getElementById('genre-filter');
    const yearFilter = document.getElementById('year-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const watchlistContainer = document.getElementById('watchlist-container');
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav a');
    
    const trailerCarousel = document.getElementById('trailer-carousel');
    const trailerSearchInput = document.getElementById('trailer-search-input');
    const trailerSearchButton = document.getElementById('trailer-search-button');

    let modalComponent = null;

    const init = async () => {
        setupNavigation();
        UI.populateYearFilter(yearFilter);
        
        setupStateObservers();
        
        MoviesController.fetchGenres();
        MoviesController.fetchMovies();
        
        setupEventListeners();

        import('../features/theme/theme.controller.js').then(({ setupTheme }) => setupTheme());
        import('../components/notification/notifications.js').then(({ setupNotifications }) => setupNotifications());
    };

    const setupStateObservers = () => {
        let prevGenres = null;

        subscribe(async (state) => {
            MoviesView.renderMovies(state, movieContainer, showDetails);
            MoviesView.renderTrailers(state, trailerCarousel);
            if (prevGenres !== state.genres) {
                prevGenres = state.genres;
                MoviesView.renderGenres(state, genreFilter);
                
                const { setupCustomSelects } = await import('../components/select/select.js');
                setupCustomSelects();
            }
        });
    };

    const setupNavigation = () => {
        Router.init(sections, navLinks, {
            loadWatchlist,
            showDetails,
            loadTrailers: () => MoviesController.fetchTrailers('')
        });
    };

    const showDetails = async (id, type) => {
        try {
            const [{ setupModal }, { TmdbAPI }] = await Promise.all([
                import('../components/modal/modal.js'),
                import('../services/tmdb.service.js')
            ]);
            
            if (!modalComponent) {
                modalComponent = setupModal((nextId, nextType) => showDetails(nextId, nextType));
            }

            modalComponent.openLoadingModal();
            const item = await TmdbAPI.fetchDetails(id, type);
            
            const fetchRecs = async (itemId, itemType) => {
                return await TmdbAPI.fetchRecommendations(itemId, itemType);
            };
            
            modalComponent.openModal(item, type, fetchRecs);
        } catch (error) {
            console.error('Erro ao mostrar detalhes:', error);
        }
    };

    const loadWatchlist = () => {
        const watchlist = StorageService.getWatchlist();
        if (watchlist.length === 0) {
            watchlistContainer.textContent = '';
            const p = document.createElement('p');
            p.textContent = 'Sua lista de favoritos está vazia.';
            watchlistContainer.appendChild(p);
        } else {
            MoviesView.renderMovies({ isAppending: false, isLoading: false, moviesList: watchlist }, watchlistContainer, showDetails);
        }
    };

    const setupEventListeners = () => {
        MoviesEvents.init({
            searchInput, searchButton, mainSearchContainer, searchHistoryDropdown,
            typeFilter, genreFilter, yearFilter, ratingFilter, 
            trailerCarousel, trailerSearchButton, trailerSearchInput
        });
    };

    init();
});