export const UI = {
    showSkeletons(container) {
        container.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const skeleton = document.createElement('div');
            skeleton.classList.add('skeleton-card');
            container.appendChild(skeleton);
        }
    },

    displayContent(items, container, currentType, append = false, onCardClick) {
        if (!append) container.innerHTML = '';
        if (items.length === 0 && !append) {
            container.innerHTML = `<p style="color: var(--text-light)">Nenhum resultado encontrado.</p>`;
            return;
        }

        const imgUrl = 'https://image.tmdb.org/t/p/w500';

        items.forEach(item => {
            const title = item.title || item.name;
            const date = item.release_date || item.first_air_date;
            const year = date ? date.split('-')[0] : 'N/A';
            const itemType = (item.media_type || currentType);

            const card = document.createElement('div');
            card.classList.add('movie-card');
            const fallbackImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750" fill="%232c2c2c"><rect width="500" height="750"/><text x="50%" y="50%" fill="%23ffffff" font-size="30" font-family="sans-serif" text-anchor="middle" dy=".3em">Sem Imagem</text></svg>';
            card.innerHTML = `
                <img src="${item.poster_path ? imgUrl + item.poster_path : fallbackImg}" alt="${title}" onerror="this.onerror=null;this.src='${fallbackImg}';">
                <div class="movie-info">
                    <h3>${title}</h3>
                    <p>Ano: ${year}</p>
                </div>
                <div class="rating">${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</div>
            `;
            if (onCardClick) card.addEventListener('click', () => onCardClick(item.id, itemType));
            container.appendChild(card);
        });
    },

    displayTrailers(trailers, container) {
        container.innerHTML = '';
        if (trailers.length === 0) {
            container.innerHTML = '<p style="color: var(--text-light)">Nenhum trailer em destaque encontrado.</p>';
            return;
        }
        trailers.forEach(trailer => {
            const item = document.createElement('div');
            item.classList.add('trailer-item');
            item.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${trailer.key}" 
                title="${trailer.name}" frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
            `;
            container.appendChild(item);
        });
    },

    populateYearFilter(yearFilterSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1900; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilterSelect.appendChild(option);
        }
    }
};