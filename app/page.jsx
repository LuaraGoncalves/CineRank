import Dashboard from './components/Dashboard';
import { logger } from '../src/core/logger.js';
import { fetchTrendingHomeMovies } from '../src/services/tmdb.service.js';
import { unwrapServiceData } from '../src/services/service-result.js';

async function getTrendingMovies() {
  try {
    return unwrapServiceData(await fetchTrendingHomeMovies(), []);
  } catch (error) {
    logger.error('Home_TrendingMovies_Failed', error);
    return [];
  }
}

export default async function Home() {
  const movies = await getTrendingMovies();

  return (
    <>
      <Dashboard initialMovies={movies} />
    </>
  );
}
