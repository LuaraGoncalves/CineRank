import Dashboard from './components/Dashboard';
import { logger } from '../src/core/logger.js';
import { fetchTrendingHomeMovies } from '../src/services/tmdb.service.js';
import { SERVICE_STATUS } from '../src/services/service-result.js';

async function getTrendingMovies() {
  try {
    const result = await fetchTrendingHomeMovies();

    if (result.ok) {
      return {
        movies: result.data,
        error: null
      };
    }

    return {
      movies: [],
      error:
        result.status === SERVICE_STATUS.MISSING_CONFIG
          ? 'A chave da API não está configurada. Confira as variáveis de ambiente no Netlify.'
          : result.error ||
            'Não foi possível carregar filmes e séries agora. Tente novamente em instantes.'
    };
  } catch (error) {
    logger.error('Home_TrendingMovies_Failed', error);
    return {
      movies: [],
      error:
        'Não foi possível carregar filmes e séries agora. Tente novamente em instantes.'
    };
  }
}

export default async function Home() {
  const { movies, error } = await getTrendingMovies();

  return (
    <>
      <Dashboard initialMovies={movies} initialMoviesError={error} />
    </>
  );
}
