import MovieCard from '../components/MovieCard';
import { getWatchlist } from '../actions';

export default async function Watchlist() {
  const watchlist = await getWatchlist();

  return (
    <section id="watchlist" aria-labelledby="watchlist-title">
      <h2 id="watchlist-title">Minha Lista de Favoritos (Sincronizada no Servidor)</h2>
      <div id="watchlist-container" className="movie-container" role="region" aria-live="polite">
        {watchlist.length > 0 ? (
          watchlist.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%' }}>Sua lista no servidor está vazia. Adicione filmes para vê-los aqui!</p>
        )}
      </div>
    </section>
  );
}
