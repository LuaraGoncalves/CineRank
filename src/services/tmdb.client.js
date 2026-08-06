const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LANGUAGE = 'pt-BR';

export function getTmdbApiKey() {
  return process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY || '';
}

export function buildTmdbUrl(path, params = {}) {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return null;

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', DEFAULT_LANGUAGE);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function requestTmdb(path, params = {}, fetchOptions = {}) {
  const url = buildTmdbUrl(path, params);
  if (!url) return null;

  const hasFetchOptions = Object.keys(fetchOptions).length > 0;
  const response = hasFetchOptions
    ? await fetch(url, fetchOptions)
    : await fetch(url);
  if (!response.ok) return null;

  return response.json();
}
