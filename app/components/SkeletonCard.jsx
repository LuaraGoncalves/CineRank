export default function SkeletonCard() {
  return (
    <div className="movie-card skeleton-movie-card">
      {/* Imagem (Pôster) Placeholder animada */}
      <div className="skeleton-poster"></div>

      {/* Texto Placeholder */}
      <div className="movie-info skeleton-info">
        <div className="skeleton-line skeleton-line-title"></div>
        <div className="skeleton-line skeleton-line-rating"></div>
      </div>
    </div>
  );
}
