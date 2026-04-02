import { StorageService } from '../../core/storage.js';
import { getModalTemplate, getRecommendationsTemplate } from './modal.template.js';

export function setupModal(showDetailsCallback) {
    const modal = document.getElementById('movie-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = modal.querySelector('.close-button');

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    };

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    return {
        openLoadingModal: () => {
            modalBody.innerHTML = `
                <div class="loading-spinner-container" style="min-height: 400px;">
                    <div class="spinner"></div>
                    <p>Carregando detalhes...</p>
                </div>
            `;
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        },
        
        openModal: async (item, type, fetchRecommendationsCallback) => {
            const isFavorited = StorageService.isInWatchlist(item.id);

            modalBody.innerHTML = getModalTemplate(item, isFavorited);

            const favoriteBtn = modalBody.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', () => {
                if (StorageService.isInWatchlist(item.id)) {
                    StorageService.removeFromWatchlist(item.id);
                } else {
                    StorageService.addToWatchlist(item, type);
                }
                
                if (showDetailsCallback) showDetailsCallback(item.id, type);
            });

            modal.style.display = 'block';
            document.body.classList.add('modal-open');

            if (fetchRecommendationsCallback) {
                const recContainer = modalBody.querySelector('.recommendations-container');
                try {
                    const data = await fetchRecommendationsCallback(item.id, type);
                    const recs = data?.results?.slice(0, 5) || [];
                    recContainer.innerHTML = getRecommendationsTemplate(recs, type);

                    recContainer.querySelectorAll('.rec-card').forEach(card => {
                        card.addEventListener('click', () => {
                            const id = card.getAttribute('data-id');
                            const t = card.getAttribute('data-type');
                            window.location.hash = `/${t}/${id}`;
                        });
                    });
                } catch (error) {
                    recContainer.innerHTML = '<p>Erro ao carregar recomendações.</p>';
                }
            }
        },
        closeModal
    };
}