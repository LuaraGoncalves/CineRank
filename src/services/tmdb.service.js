import { config } from '../core/config.js';
import { request } from '../core/http.js';
import { TmdbAdapter } from './tmdb.adapter.js';

export const TmdbAPI = {
    async fetchContent(page = 1, currentType = 'movie', query = '', genre = '', year = '', rating = '') {
        try {
            let url = '';

            if (currentType === 'all') {
                if (query) {
                    url = `${config.tmdb.baseUrl}/search/multi?api_key=${config.tmdb.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`;
                } else {
                    url = `${config.tmdb.baseUrl}/trending/all/day?api_key=${config.tmdb.apiKey}&language=pt-BR&page=${page}`;
                }
            } else {
                url = `${config.tmdb.baseUrl}/discover/${currentType}?api_key=${config.tmdb.apiKey}&language=pt-BR&sort_by=popularity.desc&page=${page}`;
                
                if (query) {
                    url = `${config.tmdb.baseUrl}/search/${currentType}?api_key=${config.tmdb.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`;
                }
                if (genre) url += `&with_genres=${genre}`;
                if (year) {
                    if (currentType === 'movie') url += `&primary_release_year=${year}`;
                    else if (currentType === 'tv') url += `&first_air_date_year=${year}`;
                }
                if (rating) url += `&vote_average.gte=${rating}`;
            }

            const data = await request(url);
            console.log('[TMDB API] fetchContent - Dados recebidos:', data);
            return data;
            
        } catch (error) {
            console.error('[TMDB API] Erro no fetchContent:', error);
            throw error;
        }
    },

    async fetchGenres(currentType = 'movie') {
        try {
            if (currentType === 'all') currentType = 'movie';

            const url = `${config.tmdb.baseUrl}/genre/${currentType}/list?api_key=${config.tmdb.apiKey}&language=pt-BR`;
            const data = await request(url);

            console.log('[TMDB API] fetchGenres - Dados recebidos:', data);

            if (!data.genres) {
                throw new Error('Resposta inválida da API');
            }

            return data.genres.map(g => ({
                id: g.id,
                name: g.name
            }));
        } catch (error) {
            console.error('[TMDB API] Erro no fetchGenres:', error);
            return [];
        }
    },

    async fetchDetails(id, type = 'movie') {
        try {
            const url = `${config.tmdb.baseUrl}/${type}/${id}?api_key=${config.tmdb.apiKey}&language=pt-BR&append_to_response=credits,videos`;
            const data = await request(url);
            
            console.log('[TMDB API] fetchDetails - Dados recebidos:', data);
            
            return TmdbAdapter.adaptDetails(data, type);
        } catch (error) {
            console.error('[TMDB API] Erro no fetchDetails:', error);
            throw error;
        }
    },

    async fetchRecommendations(id, type = 'movie') {
        try {
            const url = `${config.tmdb.baseUrl}/${type}/${id}/recommendations?api_key=${config.tmdb.apiKey}&language=pt-BR&page=1`;
            const data = await request(url);
            
            console.log('[TMDB API] fetchRecommendations - Dados recebidos:', data);
            
            return {
                ...data,
                results: data.results.map(m => TmdbAdapter.adaptMovie(m, type))
            };
        } catch (error) {
            console.error('[TMDB API] Erro no fetchRecommendations:', error);
            return { results: [] };
        }
    },

    async fetchTrendingTrailers(query = '') {
        try {
            let url = `${config.tmdb.baseUrl}/trending/movie/week?api_key=${config.tmdb.apiKey}&language=pt-BR`;
            if (query) {
                url = `${config.tmdb.baseUrl}/search/movie?api_key=${config.tmdb.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
            }
            
            const data = await request(url);
            console.log('[TMDB API] fetchTrendingTrailers (Lista) - Dados recebidos:', data);
            
            const trailerPromises = data.results.map(async (movie) => {
                try {
                    const videoUrl = `${config.tmdb.baseUrl}/movie/${movie.id}/videos?api_key=${config.tmdb.apiKey}`;
                    const videoData = await request(videoUrl);
                    const trailerRaw = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                    return trailerRaw ? TmdbAdapter.adaptTrailer(trailerRaw) : null;
                } catch (err) {
                    console.error(`[TMDB API] Erro ao buscar trailer para filme ${movie.id}:`, err);
                    return null;
                }
            });

            const resolved = await Promise.all(trailerPromises);
            return resolved.filter(t => t !== null);
        } catch (error) {
            console.error('[TMDB API] Erro no fetchTrendingTrailers:', error);
            throw error;
        }
    },

    async fetchPopularMoviesForQuiz() {
        try {
            const url = `${config.tmdb.baseUrl}/movie/popular?api_key=${config.tmdb.apiKey}&language=pt-BR&page=1`;
            const data = await request(url);
            
            console.log('[TMDB API] fetchPopularMoviesForQuiz - Dados recebidos:', data);
            
            return {
                ...data,
                results: data.results.map(m => TmdbAdapter.adaptMovie(m, 'movie'))
            };
        } catch (error) {
            console.error('[TMDB API] Erro no fetchPopularMoviesForQuiz:', error);
            throw error;
        }
    }
};