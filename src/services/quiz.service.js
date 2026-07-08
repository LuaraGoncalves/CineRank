import { fetchPopularMoviesForQuiz as fetchPopularMoviesFromTmdb } from './tmdb.service.js';

export async function fetchPopularMoviesForQuiz() {
    return fetchPopularMoviesFromTmdb();
}
