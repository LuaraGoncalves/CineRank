import { debounce } from '../../utils/debounce.js';
import { StorageService } from '../../core/storage.js';
import { getState } from './movies.state.js';
import { MoviesController } from './movies.controller.js';
import { sanitizeHTML } from '../../utils/dom.js';

export const MoviesEvents = {
    init({
        searchInput, searchButton, mainSearchContainer, searchHistoryDropdown,
        typeFilter, genreFilter, yearFilter, ratingFilter, 
        trailerCarousel, trailerSearchButton, trailerSearchInput
    }) {

        let trailerIndex = 0;

        const updateCarousel = (direction = 0) => {
            const totalItems = trailerCarousel.children.length;
            if (totalItems === 0) return;
            trailerIndex = (trailerIndex + direction + totalItems) % totalItems;
            trailerCarousel.style.transform = `translateX(-${trailerIndex * 100}%)`;
        };

        const renderSearchHistory = () => {
            const history = StorageService.getSearchHistory();
            if (history.length === 0) {
                searchHistoryDropdown.style.display = 'none';
                return;
            }
            
            searchHistoryDropdown.innerHTML = history.map(item => `
                <div class="history-item">
                    <svg class="history-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path><path d="M11 6v5l4 4"></path></svg>
                    <span>${sanitizeHTML(item)}</span>
                </div>
            `).join('');
            
            if (document.body.classList.contains('light-mode')) {
                searchHistoryDropdown.classList.add('light-mode-dropdown');
            } else {
                searchHistoryDropdown.classList.remove('light-mode-dropdown');
            }
            
            searchHistoryDropdown.querySelectorAll('.history-item').forEach(el => {
                el.addEventListener('click', () => {
                    searchInput.value = el.querySelector('span').textContent;
                    searchHistoryDropdown.style.display = 'none';
                    MoviesController.updateSearchQuery(searchInput.value.trim());
                });
            });
            searchHistoryDropdown.style.display = 'block';
        };

        searchButton.addEventListener('click', () => {
            if (!mainSearchContainer.classList.contains('active')) {
                mainSearchContainer.classList.add('active');
                searchInput.focus();
            } else {
                if (searchInput.value.trim()) {
                    StorageService.addSearchHistory(searchInput.value.trim());
                    MoviesController.updateSearchQuery(searchInput.value.trim());
                } else {
                    mainSearchContainer.classList.remove('active');
                }
            }
        });

        searchInput.addEventListener('focus', () => {
            if (!searchInput.value.trim()) renderSearchHistory();
        });

        searchInput.addEventListener('input', debounce(() => {
            if (searchInput.value.trim()) {
                searchHistoryDropdown.style.display = 'none';
                StorageService.addSearchHistory(searchInput.value.trim());
                MoviesController.updateSearchQuery(searchInput.value.trim());
            } else {
                renderSearchHistory();
            }
        }, 300));

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                StorageService.addSearchHistory(searchInput.value.trim());
                MoviesController.updateSearchQuery(searchInput.value.trim());
            }
        });

        document.addEventListener('click', (e) => {
            if (!mainSearchContainer.contains(e.target)) {
                searchHistoryDropdown.style.display = 'none';
                if (mainSearchContainer.classList.contains('active') && !searchInput.value.trim()) {
                    mainSearchContainer.classList.remove('active');
                }
            }
        });

        typeFilter.addEventListener('change', () => {
            MoviesController.updateType(typeFilter.value);
        });

        genreFilter.addEventListener('change', () => MoviesController.updateSearchParams({ genre: genreFilter.value !== 'all' ? genreFilter.value : '' }));
        yearFilter.addEventListener('change', () => MoviesController.updateSearchParams({ year: yearFilter.value !== 'all' ? yearFilter.value : '' }));
        ratingFilter.addEventListener('change', () => MoviesController.updateSearchParams({ rating: ratingFilter.value !== 'all' ? ratingFilter.value : '' }));

        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const state = getState();
            
            if (scrollTop + clientHeight >= scrollHeight - 100 && !state.isLoading) {
                MoviesController.loadNextPage();
            }
        });

        document.querySelector('.carousel-btn.prev').addEventListener('click', () => updateCarousel(-1));
        document.querySelector('.carousel-btn.next').addEventListener('click', () => updateCarousel(1));

        trailerSearchButton.addEventListener('click', () => {
            MoviesController.fetchTrailers(trailerSearchInput.value.trim());
            trailerIndex = 0;
            updateCarousel(0);
        });
        trailerSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                MoviesController.fetchTrailers(trailerSearchInput.value.trim());
                trailerIndex = 0;
                updateCarousel(0);
            }
        });
    }
};