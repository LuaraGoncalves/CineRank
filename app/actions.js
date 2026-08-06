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
import { unwrapServiceData } from '../src/services/service-result.js';

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

export async function fetchGenres(type = 'movie') {
  try {
    return unwrapServiceData(await fetchGenresService(type), []);
  } catch (error) {
    logger.error('Action_FetchGenres_Failed', error);
    return [];
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

export async function fetchPopularMoviesForQuiz() {
  try {
    return unwrapServiceData(await fetchPopularMoviesForQuizService(), []);
  } catch (error) {
    logger.error('Action_FetchPopularMoviesForQuiz_Failed', error);
    return [];
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
