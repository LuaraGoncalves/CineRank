function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toStringOrNull(value) {
  return typeof value === 'string' && value.trim() ? value : null;
}

function normalizeMediaType(item, fallbackType = null) {
  if (item?.media_type === 'movie' || item?.media_type === 'tv') {
    return item.media_type;
  }
  if (fallbackType === 'movie' || fallbackType === 'tv') return fallbackType;
  if (item?.title) return 'movie';
  if (item?.name) return 'tv';
  return null;
}

export function normalizeMediaItem(item, fallbackType = null) {
  if (!item?.id) return null;

  const mediaType = normalizeMediaType(item, fallbackType);
  if (!mediaType) return null;

  return {
    ...item,
    id: item.id,
    media_type: mediaType,
    title: toStringOrNull(item.title),
    name: toStringOrNull(item.name),
    overview: toStringOrNull(item.overview) || '',
    poster_path: toStringOrNull(item.poster_path),
    backdrop_path: toStringOrNull(item.backdrop_path),
    vote_average: toNumber(item.vote_average),
    release_date: toStringOrNull(item.release_date),
    first_air_date: toStringOrNull(item.first_air_date),
    genre_ids: Array.isArray(item.genre_ids) ? item.genre_ids : []
  };
}

export function normalizeMediaList(items, fallbackType = null) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => normalizeMediaItem(item, fallbackType))
    .filter(Boolean);
}

export function normalizeGenres(genres) {
  if (!Array.isArray(genres)) return [];
  return genres
    .map((genre) => ({
      id: genre?.id,
      name: toStringOrNull(genre?.name)
    }))
    .filter((genre) => genre.id && genre.name);
}

export function normalizeMovieDetails(details, fallbackType = null) {
  const normalized = normalizeMediaItem(details, fallbackType);
  if (!normalized) return null;

  return {
    ...normalized,
    genres: normalizeGenres(details?.genres),
    runtime: details?.runtime ? toNumber(details.runtime) : null,
    credits: {
      crew: Array.isArray(details?.credits?.crew) ? details.credits.crew : [],
      cast: Array.isArray(details?.credits?.cast) ? details.credits.cast : []
    },
    created_by: Array.isArray(details?.created_by) ? details.created_by : [],
    videos: {
      results: Array.isArray(details?.videos?.results)
        ? details.videos.results
        : []
    }
  };
}
