import { getTmdbApiKey, requestTmdb } from './tmdb.client.js';
import { normalizeMediaList } from './tmdb.normalizers.js';

const TRAILER_SOURCE_PAGES = 3;
const MAX_MOVIES_TO_CHECK = 24;

export async function fetchTrendingTrailers(query = '') {
  if (!getTmdbApiKey()) return [];

  const pageRequests = Array.from(
    { length: TRAILER_SOURCE_PAGES },
    (_, index) => {
      const page = index + 1;
      if (query) {
        return requestTmdb('/search/movie', { query, page });
      }
      return requestTmdb('/trending/movie/week', { page });
    }
  );

  const pages = await Promise.all(pageRequests);
  const movies = normalizeMediaList(
    pages.flatMap((data) => data?.results || []),
    'movie'
  )
    .filter(
      (movie, index, allMovies) =>
        allMovies.findIndex((item) => item.id === movie.id) === index
    )
    .slice(0, MAX_MOVIES_TO_CHECK);

  const trailerPromises = movies.map(async (movie) => {
    try {
      const videoData = await requestTmdb(`/movie/${movie.id}/videos`, {
        include_video_language: 'pt-BR,en,en-US'
      });

      let trailerRaw = videoData?.results?.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      );
      if (!trailerRaw) {
        trailerRaw = videoData?.results?.find(
          (v) =>
            (v.type === 'Teaser' || v.type === 'Clip') && v.site === 'YouTube'
        );
      }

      if (!trailerRaw) return null;

      return {
        id: trailerRaw.id,
        key: trailerRaw.key,
        name: trailerRaw.name,
        movieTitle: movie.title || movie.name,
        thumbnailUrl: `https://img.youtube.com/vi/${trailerRaw.key}/maxresdefault.jpg`
      };
    } catch {
      return null;
    }
  });

  const resolved = await Promise.all(trailerPromises);
  return resolved.filter(Boolean);
}
