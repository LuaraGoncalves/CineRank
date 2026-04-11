import Link from 'next/link';

export default function MovieCard({ movie }) {
  const type = movie.title ? 'movie' : 'tv';
  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem';
    
  return (
    <Link href={`/filme/${movie.id}?type=${type}`} style={{ textDecoration: 'none' }}>
      <div 
        className="movie-card" 
        tabIndex="0" 
        role="button" 
        aria-label={`Detalhes sobre ${movie.title || movie.name}`}
      >
        <img src={posterPath} alt={`Pôster de ${movie.title || movie.name}`} />
        <div className="movie-info">
          <h3>{movie.title || movie.name}</h3>
          <span className="rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>
    </Link>
  );
}
