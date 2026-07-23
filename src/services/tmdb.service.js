import { getTmdbApiKey, requestTmdb } from './tmdb.client.js';
import {
  normalizeGenres,
  normalizeMediaList,
  normalizeMovieDetails
} from './tmdb.normalizers.js';
import {
  serviceFailure,
  serviceMissingConfig,
  serviceSuccess
} from './service-result.js';

export async function searchMulti(query = '') {
  if (!query) return serviceSuccess([]);
  if (!getTmdbApiKey()) return serviceMissingConfig('TMDB_API_KEY');

  const data = await requestTmdb('/search/multi', {
    query,
    page: 1
  });
  if (!data) return serviceFailure('Não foi possível buscar filmes e séries');

  return serviceSuccess(normalizeMediaList(data.results).slice(0, 5));
}

export async function fetchFilteredMovies({
  type = 'all',
  genre = 'all',
  year = 'all',
  rating = 'all',
  page = 1
} = {}) {
  if (!getTmdbApiKey()) return serviceMissingConfig('TMDB_API_KEY');

  let path = '';
  const params = { page };
  if (type === 'all') {
    path = '/trending/all/day';
  } else {
    path = `/discover/${type}`;
    params.sort_by = 'popularity.desc';
    if (genre !== 'all') params.with_genres = genre;
    if (year !== 'all') {
      if (type === 'movie') params.primary_release_year = year;
      else if (type === 'tv') params.first_air_date_year = year;
    }
    if (rating !== 'all') params['vote_average.gte'] = rating;
  }

  const data = await requestTmdb(path, params);
  if (!data) return serviceFailure('Não foi possível buscar conteúdos');

  return serviceSuccess(
    normalizeMediaList(data.results, type === 'all' ? null : type)
  );
}

export async function fetchGenres(type = 'movie') {
  if (!getTmdbApiKey()) return serviceMissingConfig('TMDB_API_KEY');

  const targetType = type === 'all' ? 'movie' : type;
  const data = await requestTmdb(`/genre/${targetType}/list`);
  if (!data) return serviceFailure('Não foi possível buscar gêneros');

  return serviceSuccess(normalizeGenres(data.genres));
}

export async function fetchMovieDetailsAndRecs(id, type) {
  if (!getTmdbApiKey()) {
    return serviceMissingConfig('TMDB_API_KEY');
  }

  const [details, recData] = await Promise.all([
    requestTmdb(`/${type}/${id}`, {
      append_to_response: 'credits,videos'
    }),
    requestTmdb(`/${type}/${id}/recommendations`, {
      page: 1
    })
  ]);

  const normalizedDetails = normalizeMovieDetails(details, type);
  if (!normalizedDetails) {
    return serviceFailure('Não foi possível buscar detalhes do conteúdo');
  }

  return serviceSuccess({
    details: normalizedDetails,
    recommendations: normalizeMediaList(recData?.results, type)
  });
}

export async function fetchPopularMoviesForQuiz() {
  if (!getTmdbApiKey()) return serviceMissingConfig('TMDB_API_KEY');

  const data = await requestTmdb('/movie/popular', {
    page: 1
  });
  if (!data) return serviceFailure('Não foi possível buscar filmes do quiz');

  return serviceSuccess(normalizeMediaList(data.results, 'movie'));
}
