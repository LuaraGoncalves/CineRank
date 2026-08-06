import { fetchMovieDetailsAndRecs } from '../../actions';
import Image from 'next/image';
import SaveButton from './SaveButton';

// ISR: revalida a cada 1 hora (3600 segundos)
export const revalidate = 3600;

export default async function FilmeDetails({ params, searchParams }) {
  const { id } = await params;
  const { type = 'movie' } = await searchParams;

  const { details, recommendations } = await fetchMovieDetailsAndRecs(id, type);

  if (!details) {
    return (
      <main className="details-not-found">
        <h1>Filme/Série não encontrado</h1>
        <p>A API não retornou dados para este ID.</p>
      </main>
    );
  }

  const directorOrCreator =
    type === 'movie'
      ? details.credits?.crew?.find((c) => c.job === 'Director')?.name ||
        'Desconhecido'
      : details.created_by
          ?.map((person) => person.name)
          .filter(Boolean)
          .join(', ') ||
        details.credits?.crew?.find((c) => c.job === 'Creator')?.name ||
        'Desconhecido';
  const posterPath = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : null;

  return (
    <main className="details-page">
      <div className="details-hero">
        {posterPath ? (
          <Image
            src={posterPath}
            alt={details.title || details.name}
            width={500}
            height={750}
            className="details-poster"
          />
        ) : (
          <div className="details-poster details-poster-fallback">
            Sem imagem
          </div>
        )}

        <div className="details-content">
          <h1 className="details-title">{details.title || details.name}</h1>
          <p className="details-rating">
            ⭐ {details.vote_average?.toFixed(1)}/10
          </p>

          <div className="details-meta">
            <p>
              <strong>{type === 'movie' ? 'Diretor:' : 'Criador:'}</strong>{' '}
              {directorOrCreator}
            </p>
            <p>
              <strong>Gêneros:</strong>{' '}
              {details.genres?.map((g) => g.name).join(', ') || 'N/A'}
            </p>
            {details.runtime && (
              <p>
                <strong>Duração:</strong> {details.runtime} min
              </p>
            )}
            {details.release_date && (
              <p>
                <strong>Lançamento:</strong>{' '}
                {new Date(details.release_date).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <SaveButton movie={details} />

          <h3 className="details-section-title">Sinopse</h3>
          <p className="details-overview">
            {details.overview || 'Sinopse não disponível.'}
          </p>
        </div>
      </div>

      {recommendations?.length > 0 && (
        <section aria-labelledby="recs-title">
          <h2 id="recs-title" className="details-recommendations-title">
            Recomendações
          </h2>
          <div className="movie-container details-recommendations-grid">
            {recommendations.slice(0, 5).map((rec) => (
              <a
                key={rec.id}
                href={`/filme/${rec.id}?type=${type}`}
                className="details-recommendation-link"
              >
                <div className="details-recommendation-card">
                  {rec.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                      alt={rec.title || rec.name}
                      width={300}
                      height={450}
                      className="details-recommendation-poster"
                    />
                  ) : (
                    <div className="details-recommendation-poster details-recommendation-fallback">
                      Sem imagem
                    </div>
                  )}
                  <div className="details-recommendation-body">
                    <p className="details-recommendation-name">
                      {rec.title || rec.name}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
