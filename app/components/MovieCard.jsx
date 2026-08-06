import Link from 'next/link';
import Image from 'next/image';

export default function MovieCard({ movie }) {
  const type = movie.title ? 'movie' : 'tv';
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const title = movie.title || movie.name;

  return (
    <Link href={`/filme/${movie.id}?type=${type}`} className="movie-card-link">
      <div
        className="movie-card"
        tabIndex="0"
        role="button"
        aria-label={`Detalhes sobre ${title}`}
      >
        {posterPath ? (
          <Image
            src={posterPath}
            alt={`Pôster de ${title}`}
            width={500}
            height={750}
          />
        ) : (
          <div className="movie-poster-fallback" aria-hidden="true">
            Sem imagem
          </div>
        )}
        <div className="movie-info">
          <h3>{title}</h3>
          <span className="rating">
            ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>
    </Link>
  );
}
