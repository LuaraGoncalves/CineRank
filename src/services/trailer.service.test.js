import { jest } from '@jest/globals';
import { fetchTrendingTrailers } from './trailer.service.js';

describe('fetchTrendingTrailers', () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.TMDB_API_KEY;
  const jsonResponse = (body, init = {}) => ({
    ok: !init.status || init.status < 400,
    status: init.status || 200,
    json: async () => body
  });

  beforeEach(() => {
    process.env.TMDB_API_KEY = 'tmdb-test-key';
    global.fetch = jest.fn(async (url) => {
      const urlText = String(url);

      if (urlText.includes('/trending/movie/week')) {
        const page = new URL(urlText).searchParams.get('page');
        const resultsByPage = {
          1: [
            { id: 1, title: 'Movie One' },
            { id: 2, title: 'Movie Two' }
          ],
          2: [
            { id: 2, title: 'Movie Two Duplicate' },
            { id: 3, title: 'Movie Three' }
          ],
          3: [{ id: 4, title: 'Movie Four' }]
        };

        return jsonResponse({ results: resultsByPage[page] || [] });
      }

      if (urlText.includes('/videos')) {
        const movieId = urlText.match(/movie\/(\d+)\/videos/)?.[1];
        return jsonResponse({
          results: [
            {
              id: `video-${movieId}`,
              key: `youtube-${movieId}`,
              name: `Trailer ${movieId}`,
              site: 'YouTube',
              type: 'Trailer'
            }
          ]
        });
      }

      return jsonResponse({}, { status: 404 });
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.TMDB_API_KEY = originalApiKey;
  });

  it('busca multiplas paginas e remove filmes duplicados antes de montar trailers', async () => {
    const trailers = await fetchTrendingTrailers();

    expect(trailers).toHaveLength(4);
    expect(trailers.map((trailer) => trailer.movieTitle)).toEqual([
      'Movie One',
      'Movie Two',
      'Movie Three',
      'Movie Four'
    ]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=3')
    );
  });
});
