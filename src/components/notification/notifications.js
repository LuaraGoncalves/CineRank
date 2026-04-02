import { StorageService } from '../../core/storage.js';
import { TranslationAPI, NewsAPI } from '../../services/services.js';

export function setupNotifications() {
    const notificationBell = document.getElementById('notification-bell');
    const notificationDot = document.getElementById('notification-dot');
    const newsModal = document.getElementById('news-modal');
    const newsContainer = document.getElementById('news-container');
    const newsModalCloseButton = newsModal.querySelector('.close-button');

    notificationBell.addEventListener('click', () => {
        newsModal.style.display = 'block';
        notificationDot.style.display = 'none';
        
        const articles = newsContainer.querySelectorAll('.news-item');
        if (articles.length > 0) {
            StorageService.setLastSeenNewsDate(new Date().toISOString());
        }
    });

    newsModalCloseButton.addEventListener('click', () => {
        newsModal.style.display = 'none';
    });

    async function loadNews() {
        if (!newsContainer) return;
        
        try {
            const data = await NewsAPI.fetchNews();
            
            if (data.status === 'error') {
                newsContainer.innerHTML = `<p>Ocorreu um erro ao buscar as notícias. Verifique sua chave de API.</p>`;
                return;
            }

            const articles = data.articles.slice(0, 15);
            if (articles.length === 0) {
                newsContainer.innerHTML = '<p>Nenhuma notícia encontrada no momento.</p>';
                return;
            }

            const lastSeenDate = StorageService.getLastSeenNewsDate();
            if (articles.length > 0 && (!lastSeenDate || new Date(articles[0].publishedAt) > new Date(lastSeenDate))) {
                if (notificationDot) notificationDot.style.display = 'block';
            }

            newsContainer.innerHTML = articles.map(article => `
                <div class="news-item">
                    <h3 class="news-title"><a href="${article.url}" target="_blank">${article.title}</a></h3>
                    <p class="news-meta">${article.source.name} - ${new Date(article.publishedAt).toLocaleDateString()}</p>
                    <p class="news-desc">${article.description || 'Sem descrição disponível.'}</p>
                    <button class="translate-btn" data-title="${encodeURIComponent(article.title)}" data-desc="${encodeURIComponent(article.description || '')}">Traduzir para Português</button>
                </div>
            `).join('');

            
            document.querySelectorAll('.translate-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const button = e.target;
                    const newsItem = button.closest('.news-item');
                    const titleEl = newsItem.querySelector('.news-title a');
                    const descEl = newsItem.querySelector('.news-desc');
                    
                    const originalTitle = decodeURIComponent(button.getAttribute('data-title'));
                    const originalDesc = decodeURIComponent(button.getAttribute('data-desc'));

                    if (button.classList.contains('translated')) {
                        titleEl.textContent = originalTitle;
                        descEl.textContent = originalDesc || 'Sem descrição disponível.';
                        button.textContent = 'Traduzir para Português';
                        button.classList.remove('translated');
                        return;
                    }

                    button.textContent = 'Traduzindo...';
                    button.disabled = true;

                    try {
                        const translatedTitle = await TranslationAPI.translate(originalTitle);
                        const translatedDesc = await TranslationAPI.translate(originalDesc);

                        titleEl.textContent = translatedTitle;
                        if (originalDesc) descEl.textContent = translatedDesc;
                        
                        button.textContent = 'Ver Original (Inglês)';
                        button.classList.add('translated');
                    } catch (err) {
                        console.error('Erro na tradução:', err);
                        button.textContent = 'Erro. Tentar novamente';
                    } finally {
                        button.disabled = false;
                    }
                });
            });

        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
            newsContainer.innerHTML = `<p>Não foi possível carregar as notícias. Tente novamente mais tarde.</p>`;
        }
    }

    loadNews();
}
