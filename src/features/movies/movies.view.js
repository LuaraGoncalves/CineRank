export const MoviesView = {
    _clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    },

    renderSkeletons(container) {
        this._clearContainer(container);
        
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 10; i++) {
            const skeleton = document.createElement('div');
            skeleton.classList.add('skeleton-card');
            fragment.appendChild(skeleton);
        }
        container.appendChild(fragment);
    },

    renderMovies(state, container, onCardClick) {
        if (!state.isAppending) {
            this._clearContainer(container);
        }
        
        if (state.isLoading && !state.isAppending) {
            this.renderSkeletons(container);
            return;
        }

        if (state.error) {
            this._clearContainer(container);
            const errorMsg = document.createElement('p');
            errorMsg.style.color = 'var(--text-light)';
            errorMsg.textContent = 'Erro ao carregar conteúdo.';
            container.appendChild(errorMsg);
            return;
        }

        if (!state.isLoading && state.moviesList.length === 0) {
            this._clearContainer(container);
            const noResults = document.createElement('p');
            noResults.style.color = 'var(--text-light)';
            noResults.textContent = 'Nenhum resultado encontrado.';
            container.appendChild(noResults);
            return;
        }

        this._clearContainer(container);

        const fragment = document.createDocumentFragment();

        const movies = state.moviesList || [];
        movies.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('movie-card');

            const fallbackImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750" fill="%232c2c2c"><rect width="500" height="750"/><text x="50%" y="50%" fill="%23ffffff" font-size="30" font-family="sans-serif" text-anchor="middle" dy=".3em">Sem Imagem</text></svg>';
            
            const img = document.createElement('img');
            img.src = item.image || fallbackImg;
            img.alt = item.title;
            img.loading = 'lazy'; 
            img.onerror = function() {
                this.onerror = null; 
                this.src = fallbackImg;
            };

            card.appendChild(img);

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('movie-info');
            
            const titleElement = document.createElement('h3');
            titleElement.textContent = item.title;
            
            const yearElement = document.createElement('p');
            yearElement.textContent = `Ano: ${item.year || 'N/A'}`;

            infoDiv.appendChild(titleElement);
            infoDiv.appendChild(yearElement);
            card.appendChild(infoDiv);

            const ratingElement = document.createElement('div');
            ratingElement.classList.add('rating');
            ratingElement.textContent = item.rating;
            card.appendChild(ratingElement);

            if (onCardClick) {
                card.addEventListener('click', () => {
                    window.location.hash = `/${item.type}/${item.id}`;
                });
            }
            
            fragment.appendChild(card);
        });

        container.appendChild(fragment);
    },

    renderTrailers(state, container) {
        this._clearContainer(container);
        
        if (state.trailers.length === 0) {
            const noTrailers = document.createElement('p');
            noTrailers.style.color = 'var(--text-light)';
            noTrailers.textContent = 'Nenhum trailer encontrado.';
            container.appendChild(noTrailers);
            return;
        }

        const fragment = document.createDocumentFragment();
        
        const trailers = state.trailers || [];
        trailers.forEach(trailer => {
            const item = document.createElement('div');
            item.classList.add('trailer-item');
            
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
            iframe.title = trailer.name;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');
            
            item.appendChild(iframe);
            fragment.appendChild(item);
        });

        container.appendChild(fragment);
    },

    renderGenres(state, selectElement) {
        if (!selectElement) return;

        selectElement.textContent = '';
        
        const placeholderOption = document.createElement('option');
        placeholderOption.value = 'all';
        placeholderOption.textContent = 'Gênero';
        placeholderOption.hidden = true;
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        selectElement.appendChild(placeholderOption);

        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'Qualquer Gênero';
        selectElement.appendChild(allOption);
        
        const genres = state.genres || [];
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            selectElement.appendChild(option);
        });
    }
};