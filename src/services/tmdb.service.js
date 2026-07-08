const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getApiKey() {
  return process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY || '';
}

async function requestJson(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}

export async function searchMulti(query = '') {
  const apiKey = getApiKey();
  if (!apiKey || !query) return [];

  const url = `${TMDB_BASE_URL}/search/multi?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
  const data = await requestJson(url);
  return (data?.results || [])
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .slice(0, 5);
}

export async function fetchFilteredMovies({
  type = 'all',
  genre = 'all',
  year = 'all',
  rating = 'all',
  page = 1
} = {}) {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  let url = '';
  if (type === 'all') {
    url = `${TMDB_BASE_URL}/trending/all/day?api_key=${apiKey}&language=pt-BR&page=${page}`;
  } else {
    url = `${TMDB_BASE_URL}/discover/${type}?api_key=${apiKey}&language=pt-BR&sort_by=popularity.desc&page=${page}`;
    if (genre !== 'all') url += `&with_genres=${genre}`;
    if (year !== 'all') {
      if (type === 'movie') url += `&primary_release_year=${year}`;
      else if (type === 'tv') url += `&first_air_date_year=${year}`;
    }
    if (rating !== 'all') url += `&vote_average.gte=${rating}`;
  }

  const data = await requestJson(url);
  return data?.results || [];
}

export async function fetchGenres(type = 'movie') {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const targetType = type === 'all' ? 'movie' : type;
  const url = `${TMDB_BASE_URL}/genre/${targetType}/list?api_key=${apiKey}&language=pt-BR`;
  const data = await requestJson(url);
  return data?.genres || [];
}

export async function fetchMovieDetailsAndRecs(id, type) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('Chave da API TMDB_API_KEY ausente no .env');
    return { details: null, recommendations: [] };
  }

  const detailsUrl = `${TMDB_BASE_URL}/${type}/${id}?api_key=${apiKey}&language=pt-BR&append_to_response=credits,videos`;
  const recUrl = `${TMDB_BASE_URL}/${type}/${id}/recommendations?api_key=${apiKey}&language=pt-BR&page=1`;

  const [details, recData] = await Promise.all([
    requestJson(detailsUrl),
    requestJson(recUrl)
  ]);

  return {
    details,
    recommendations: recData?.results || []
  };
}

export async function fetchPopularMoviesForQuiz() {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
  const data = await requestJson(url);
  return data?.results || [];
}
