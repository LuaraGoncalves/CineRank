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
import { unwrapServiceData } from '../src/services/service-result.js';

export async function searchMulti(query = '') {
  try {
    return unwrapServiceData(await searchMultiService(query), []);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchFilteredMovies(filters = {}) {
  try {
    return unwrapServiceData(await fetchFilteredMoviesService(filters), []);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchGenres(type = 'movie') {
  try {
    return unwrapServiceData(await fetchGenresService(type), []);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return { details: null, recommendations: [] };
  }
}

export async function fetchTrendingTrailers(query = '') {
  try {
    return unwrapServiceData(await fetchTrendingTrailersService(query), []);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchPopularMoviesForQuiz() {
  try {
    return unwrapServiceData(await fetchPopularMoviesForQuizService(), []);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchNews() {
  try {
    return unwrapServiceData(await fetchNewsService(), []);
  } catch (error) {
    console.error(error);
    return [];
  }
}
