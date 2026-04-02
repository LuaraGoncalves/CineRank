export function handleError(error) {
    console.error('[App Error]', error);
    showErrorToast(error.message || 'Oops! Algo deu errado. Verifique sua conexão e tente novamente.');
}

function showErrorToast(message) {
    let toast = document.getElementById('error-toast-notification');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'error-toast-notification';
        
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#f44336',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: 'none',
            maxWidth: '350px'
        });

        const icon = document.createElement('div');
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>`;
        icon.style.display = 'flex';
        
        const text = document.createElement('span');
        text.id = 'error-toast-text';
        
        toast.appendChild(icon);
        toast.appendChild(text);
        document.body.appendChild(toast);
    }
    
    const textEl = toast.querySelector('#error-toast-text');
    
    if (message.includes('fetch') || message.includes('HTTP')) {
        textEl.textContent = 'Erro de comunicação com o servidor. Tente novamente.';
    } else {
        textEl.textContent = message;
    }
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    toast.timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 4000);
}
