'use server';

import {
  searchMulti as searchMultiService,
  fetchFilteredMovies as fetchFilteredMoviesService,
  fetchGenres as fetchGenresService,
  fetchMovieDetailsAndRecs as fetchMovieDetailsAndRecsService
} from '../src/services/tmdb.service.js';
import { fetchTrendingTrailers as fetchTrendingTrailersService } from '../src/services/trailer.service.js';
import { fetchPopularMoviesForQuiz as fetchPopularMoviesForQuizService } from '../src/services/quiz.service.js';
import { fetchNews as fetchNewsService } from '../src/services/news.service.js';
import { logger } from '../src/core/logger.js';
import {
  SERVICE_STATUS,
  unwrapServiceData
} from '../src/services/service-result.js';

function getFriendlyApiError(result, fallbackMessage) {
  if (result?.status === SERVICE_STATUS.MISSING_CONFIG) {
    return 'A chave da API não está configurada. Confira as variáveis de ambiente no Netlify.';
  }

  return result?.error || fallbackMessage;
}

function toActionResult(result, fallbackData, fallbackMessage) {
  if (result?.ok) {
    return {
      ok: true,
      status: result.status,
      data: result.data ?? fallbackData,
      error: null
    };
  }

  return {
    ok: false,
    status: result?.status || SERVICE_STATUS.ERROR,
    data: fallbackData,
    error: getFriendlyApiError(result, fallbackMessage)
  };
}

function toActionFailure(error, fallbackData, fallbackMessage) {
  logger.error('Action_Result_Failed', error);
  return {
    ok: false,
    status: SERVICE_STATUS.ERROR,
    data: fallbackData,
    error: fallbackMessage
  };
}

export async function searchMulti(query = '') {
  try {
    return unwrapServiceData(await searchMultiService(query), []);
  } catch (error) {
    logger.error('Action_SearchMulti_Failed', error);
    return [];
  }
}

export async function fetchFilteredMovies(filters = {}) {
  try {
    return unwrapServiceData(await fetchFilteredMoviesService(filters), []);
  } catch (error) {
    logger.error('Action_FetchFilteredMovies_Failed', error);
    return [];
  }
}

export async function fetchFilteredMoviesResult(filters = {}) {
  try {
    return toActionResult(
      await fetchFilteredMoviesService(filters),
      [],
      'Não foi possível carregar filmes e séries agora. Tente novamente em instantes.'
    );
  } catch (error) {
    return toActionFailure(
      error,
      [],
      'Não foi possível carregar filmes e séries agora. Tente novamente em instantes.'
    );
  }
}

export async function fetchGenres(type = 'movie') {
  try {
    return unwrapServiceData(await fetchGenresService(type), []);
  } catch (error) {
    logger.error('Action_FetchGenres_Failed', error);
    return [];
  }
}

export async function fetchGenresResult(type = 'movie') {
  try {
    return toActionResult(
      await fetchGenresService(type),
      [],
      'Não foi possível carregar os gêneros agora.'
    );
  } catch (error) {
    return toActionFailure(
      error,
      [],
      'Não foi possível carregar os gêneros agora.'
    );
  }
}

export async function fetchMovieDetailsAndRecs(id, type) {
  try {
    return unwrapServiceData(await fetchMovieDetailsAndRecsService(id, type), {
      details: null,
      recommendations: []
    });
  } catch (error) {
    logger.error('Action_FetchMovieDetailsAndRecs_Failed', error);
    return { details: null, recommendations: [] };
  }
}

export async function fetchTrendingTrailers(query = '') {
  try {
    return unwrapServiceData(await fetchTrendingTrailersService(query), []);
  } catch (error) {
    logger.error('Action_FetchTrendingTrailers_Failed', error);
    return [];
  }
}

export async function fetchTrendingTrailersResult(query = '') {
  try {
    return toActionResult(
      await fetchTrendingTrailersService(query),
      [],
      'Não foi possível carregar os trailers agora. Tente novamente em instantes.'
    );
  } catch (error) {
    return toActionFailure(
      error,
      [],
      'Não foi possível carregar os trailers agora. Tente novamente em instantes.'
    );
  }
}

export async function fetchPopularMoviesForQuiz() {
  try {
    return unwrapServiceData(await fetchPopularMoviesForQuizService(), []);
  } catch (error) {
    logger.error('Action_FetchPopularMoviesForQuiz_Failed', error);
    return [];
  }
}

export async function fetchPopularMoviesForQuizResult() {
  try {
    return toActionResult(
      await fetchPopularMoviesForQuizService(),
      [],
      'Não foi possível carregar o quiz agora. Tente novamente em instantes.'
    );
  } catch (error) {
    return toActionFailure(
      error,
      [],
      'Não foi possível carregar o quiz agora. Tente novamente em instantes.'
    );
  }
}

export async function fetchNews() {
  try {
    return unwrapServiceData(await fetchNewsService(), []);
  } catch (error) {
    logger.error('Action_FetchNews_Failed', error);
    return [];
  }
}

export async function fetchNewsResult() {
  try {
    return toActionResult(
      await fetchNewsService(),
      [],
      'Não foi possível carregar as notícias agora. Tente novamente em instantes.'
    );
  } catch (error) {
    return toActionFailure(
      error,
      [],
      'Não foi possível carregar as notícias agora. Tente novamente em instantes.'
    );
  }
}
