import { TmdbAdapter } from './tmdb.adapter.js';

describe('TMDB Adapter', () => {
    it('deve adaptar os dados brutos de um filme corretamente', () => {
        const rawItem = {
            id: 123,
            title: 'Filme Teste',
            release_date: '2023-05-10',
            media_type: 'movie',
            poster_path: '/path/to/image.jpg',
            vote_average: 8.5,
            genre_ids: [28, 12],
            overview: 'Uma sinopse legal.'
        };

        const result = TmdbAdapter.adaptMovie(rawItem);

        expect(result).toEqual({
            id: 123,
            title: 'Filme Teste',
            year: '2023',
            type: 'movie',
            image: 'https://image.tmdb.org/t/p/w500/path/to/image.jpg',
            rating: '8.5',
            rawIds: [28, 12],
            overview: 'Uma sinopse legal.'
        });
    });

    it('deve lidar com dados ausentes usando fallbacks no adaptMovie', () => {
        const rawItem = { id: 999 };
        const result = TmdbAdapter.adaptMovie(rawItem, 'tv');

        expect(result.id).toBe(999);
        expect(result.title).toBe('Título Indisponível');
        expect(result.year).toBe('N/A');
        expect(result.type).toBe('tv');
        expect(result.image).toContain('data:image/svg+xml');
        expect(result.rating).toBe('N/A');
        expect(result.rawIds).toEqual([]);
        expect(result.overview).toBe('Sinopse não disponível.');
    });

    it('deve adaptar os detalhes de um filme incluindo trailer, elenco e gêneros', () => {
        const rawDetails = {
            id: 456,
            title: 'Detalhes do Filme',
            release_date: '2020-01-01',
            genres: [{ id: 1, name: 'Ação' }, { id: 2, name: 'Aventura' }],
            credits: {
                cast: [
                    { name: 'Ator 1' },
                    { name: 'Ator 2' }
                ]
            },
            videos: {
                results: [
                    { type: 'Trailer', site: 'YouTube', key: 'xyz123' },
                    { type: 'Teaser', site: 'YouTube', key: 'abc' }
                ]
            }
        };

        const result = TmdbAdapter.adaptDetails(rawDetails);

        expect(result.genres).toEqual(['Ação', 'Aventura']);
        expect(result.cast).toEqual(['Ator 1', 'Ator 2']);
        expect(result.trailerKey).toBe('xyz123');
        expect(result.title).toBe('Detalhes do Filme');
        expect(result.year).toBe('2020');
    });
});