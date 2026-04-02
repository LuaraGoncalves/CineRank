export function getModalTemplate(item, isFavorited) {
    return `
        <div class="modal-top">
            <img src="${item.image}" alt="${item.title}">
            <div class="modal-info">
                <h3>${item.title}</h3>
                <p class="genres"><strong>Gêneros:</strong> ${item.genres.join(', ')}</p>
                <p>${item.overview}</p>
                <p class="cast"><strong>Elenco:</strong> ${item.cast.join(', ')}</p>
                <div class="modal-actions">
                    ${item.trailerKey ? `<a href="https://www.youtube.com/watch?v=${item.trailerKey}" target="_blank" class="trailer-btn">Ver Trailer</a>` : ''}
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-id="${item.id}">
                        ${isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                    </button>
                </div>
            </div>
        </div>
        <div class="modal-recommendations" id="modal-recommendations">
            <h4>Recomendações parecidas</h4>
            <div class="recommendations-container">Carregando recomendações...</div>
        </div>
    `;
}

export function getRecommendationsTemplate(recs, type) {
    if (!recs || recs.length === 0) {
        return '<p>Nenhuma recomendação encontrada.</p>';
    }

    return recs.map(rec => `
        <div class="rec-card" data-id="${rec.id}" data-type="${rec.type || type}">
            <img src="${rec.image}" alt="${rec.title}">
            <span>${rec.title}</span>
        </div>
    `).join('');
}
