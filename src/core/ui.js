export const UI = {
    populateYearFilter(yearFilterSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1900; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilterSelect.appendChild(option);
        }
    },

    showLoadingSpinner(container) {
        container.innerHTML = `
            <div class="loading-spinner-container">
                <div class="spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
    },

    showErrorState(container, onRetry) {
        container.innerHTML = `
            <div class="error-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle error-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
                <h3>Oops! Algo deu errado.</h3>
                <p>Não foi possível carregar as informações no momento. Verifique sua conexão ou tente novamente.</p>
                <button id="retry-btn" class="retry-btn">Tentar Novamente</button>
            </div>
        `;
        
        const retryBtn = container.querySelector('#retry-btn');
        if (retryBtn && onRetry) {
            retryBtn.addEventListener('click', onRetry);
        }
    }
};
