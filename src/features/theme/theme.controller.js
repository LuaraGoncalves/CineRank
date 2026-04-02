import { StorageService } from '../../core/storage.js';

export function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.querySelector('.moon-icon');
    const sunIcon = document.querySelector('.sun-icon');
    const root = document.documentElement;

    const savedTheme = StorageService.getTheme();
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        setTheme(prefersLight ? 'light' : 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
            themeToggle.setAttribute('aria-pressed', 'true');
            themeToggle.setAttribute('aria-label', 'Alternar para o modo escuro');
        } else {
            document.body.classList.remove('light-mode');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
            themeToggle.setAttribute('aria-pressed', 'false');
            themeToggle.setAttribute('aria-label', 'Alternar para o modo claro');
        }
        StorageService.setTheme(theme);
    }
}
