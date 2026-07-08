const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getApiKey() {
    return process.env.TMDB_API_KEY || '';
}

async function requestJson(url) {
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
}

export async function fetchTrendingTrailers(query = '') {
    const apiKey = getApiKey();
    if (!apiKey) return [];

    let url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}&language=pt-BR`;
    if (query) {
        url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
    }

    const data = await requestJson(url);
    const movies = data?.results || [];

    const trailerPromises = movies.slice(0, 10).map(async (movie) => {
        try {
            const videoUrl = `${TMDB_BASE_URL}/movie/${movie.id}/videos?api_key=${apiKey}&language=pt-BR&include_video_language=pt-BR,en,en-US`;
            const videoData = await requestJson(videoUrl);

            let trailerRaw = videoData?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (!trailerRaw) {
                trailerRaw = videoData?.results?.find(v => (v.type === 'Teaser' || v.type === 'Clip') && v.site === 'YouTube');
            }

            if (!trailerRaw) return null;

            return {
                id: trailerRaw.id,
                key: trailerRaw.key,
                name: trailerRaw.name,
                movieTitle: movie.title,
                thumbnailUrl: `https://img.youtube.com/vi/${trailerRaw.key}/maxresdefault.jpg`
            };
        } catch {
            return null;
        }
    });

    const resolved = await Promise.all(trailerPromises);
    return resolved.filter(Boolean);
}
