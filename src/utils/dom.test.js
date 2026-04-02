import { sanitizeHTML } from './dom.js';

describe('DOM Utils - sanitizeHTML', () => {
    it('deve retornar string vazia caso receba null ou undefined', () => {
        expect(sanitizeHTML(null)).toBe('');
        expect(sanitizeHTML(undefined)).toBe('');
        expect(sanitizeHTML('')).toBe('');
    });

    it('deve escapar tags HTML', () => {
        const input = '<script>alert("XSS")</script>';
        const output = sanitizeHTML(input);
        expect(output).toContain('&' + 'lt;' + 'script' + '&' + 'gt;');
    });

    it('deve escapar caracteres especiais como & e "', () => {
        const input = 'Jack & Jill "went" up the hill';
        const output = sanitizeHTML(input);
        expect(output).toContain('&' + 'amp;');
    });

    it('não deve alterar strings seguras', () => {
        const input = 'Apenas um texto normal.';
        const output = sanitizeHTML(input);
        expect(output).toBe('Apenas um texto normal.');
    });
});