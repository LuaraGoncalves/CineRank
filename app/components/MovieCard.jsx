import Link from 'next/link';
import Image from 'next/image';

export default function MovieCard({ movie }) {
  const type = movie.title ? 'movie' : 'tv';
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

  return (
    <Link href={`/filme/${movie.id}?type=${type}`} className="movie-card-link">
      <div
        className="movie-card"
        tabIndex="0"
        role="button"
        aria-label={`Detalhes sobre ${movie.title || movie.name}`}
      >
        <Image
          src={posterPath}
          alt={`Pôster de ${movie.title || movie.name}`}
          width={500}
          height={750}
        />
        <div className="movie-info">
          <h3>{movie.title || movie.name}</h3>
          <span className="rating">
            ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>
    </Link>
  );
}
