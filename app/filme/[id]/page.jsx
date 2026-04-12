import { fetchMovieDetailsAndRecs } from '../../actions';
import SaveButton from './SaveButton';

// ISR: revalida a cada 1 hora (3600 segundos)
export const revalidate = 3600;

export default async function FilmeDetails({ params, searchParams }) {
  const { id } = await params;
  const { type = 'movie' } = await searchParams;

  const { details, recommendations } = await fetchMovieDetailsAndRecs(id, type);

  if (!details) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Filme/Série não encontrado</h1>
        <p>A API não retornou dados para este ID.</p>
      </main>
    );
  }

  const director = details.credits?.crew?.find(c => c.job === 'Director')?.name || 'Desconhecido';
  const posterPath = details.poster_path 
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <img 
          src={posterPath} 
          alt={details.title || details.name} 
          style={{ width: '300px', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }} 
        />
        
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ marginBottom: '1rem', textAlign: 'left' }}>{details.title || details.name}</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>⭐ {details.vote_average?.toFixed(1)}/10</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-light)' }}>
            <p><strong>{type === 'movie' ? 'Diretor:' : 'Criador:'}</strong> {director}</p>
            <p><strong>Gêneros:</strong> {details.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
            {details.runtime && <p><strong>Duração:</strong> {details.runtime} min</p>}
            {details.release_date && <p><strong>Lançamento:</strong> {new Date(details.release_date).toLocaleDateString('pt-BR')}</p>}
          </div>

          <SaveButton movie={details} />

          <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem' }}>Sinopse</h3>
          <p style={{ lineHeight: '1.6' }}>{details.overview || "Sinopse não disponível."}</p>
        </div>
      </div>

      {recommendations?.length > 0 && (
        <section aria-labelledby="recs-title">
          <h2 id="recs-title" style={{ fontSize: '1.8rem', borderBottom: '1px solid #444', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            Recomendações
          </h2>
          <div className="movie-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {recommendations.slice(0, 5).map(rec => (
              <a key={rec.id} href={`/filme/${rec.id}?type=${type}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--card-bg)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
                  <img 
                    src={rec.poster_path ? `https://image.tmdb.org/t/p/w300${rec.poster_path}` : 'https://via.placeholder.com/300x450'} 
                    alt={rec.title || rec.name}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{ padding: '0.8rem' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
