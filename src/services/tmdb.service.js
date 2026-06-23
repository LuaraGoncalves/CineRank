const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getApiKey() {
    return process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY || '';
}

async function requestJson(url) {
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
}

export const TmdbAPI = {
    async fetchPopularMoviesForQuiz() {
        const apiKey = getApiKey();
        if (!apiKey) return { results: [] };

        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
        const data = await requestJson(url);
        return data || { results: [] };
    }
};
