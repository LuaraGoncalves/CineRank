"use server";

import {
  searchMulti as searchMultiService,
  fetchFilteredMovies as fetchFilteredMoviesService,
  fetchGenres as fetchGenresService,
  fetchMovieDetailsAndRecs as fetchMovieDetailsAndRecsService
} from '../src/services/tmdb.service.js';
import { fetchTrendingTrailers as fetchTrendingTrailersService } from '../src/services/trailer.service.js';
import { fetchPopularMoviesForQuiz as fetchPopularMoviesForQuizService } from '../src/services/quiz.service.js';
import { fetchNews as fetchNewsService } from '../src/services/news.service.js';

export async function searchMulti(query = '') {
  try {
    return await searchMultiService(query);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchFilteredMovies(filters = {}) {
  try {
    return await fetchFilteredMoviesService(filters);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchGenres(type = 'movie') {
  try {
    return await fetchGenresService(type);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchMovieDetailsAndRecs(id, type) {
  try {
    return await fetchMovieDetailsAndRecsService(id, type);
  } catch (error) {
    console.error(error);
    return { details: null, recommendations: [] };
  }
}

export async function fetchTrendingTrailers(query = '') {
  try {
    return await fetchTrendingTrailersService(query);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchPopularMoviesForQuiz() {
  try {
    return await fetchPopularMoviesForQuizService();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchNews() {
  try {
    return await fetchNewsService();
  } catch (error) {
    console.error(error);
    return [];
  }
}
