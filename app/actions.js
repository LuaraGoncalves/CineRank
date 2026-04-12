"use server";

export async function searchMulti(query = '') {
  try {
    const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
    if (!apiKey || !query) return [];
    
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv').slice(0, 5);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchFilteredMovies({ type = 'all', genre = 'all', year = 'all', rating = 'all', page = 1 } = {}) {
  try {
    const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY; 
    if (!apiKey) return [];

    let url = '';
    if (type === 'all') {
      url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=pt-BR&page=${page}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=pt-BR&sort_by=popularity.desc&page=${page}`;
      if (genre !== 'all') url += `&with_genres=${genre}`;
      if (year !== 'all') {
        if (type === 'movie') url += `&primary_release_year=${year}`;
        else if (type === 'tv') url += `&first_air_date_year=${year}`;
      }
      if (rating !== 'all') url += `&vote_average.gte=${rating}`;
    }

    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchGenres(type = 'movie') {
  try {
    const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY; 
    if (!apiKey) return [];
    const targetType = type === 'all' ? 'movie' : type;
    const url = `https://api.themoviedb.org/3/genre/${targetType}/list?api_key=${apiKey}&language=pt-BR`;
    
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.genres || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchMovieDetailsAndRecs(id, type) {
  try {
    const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY; 
    if (!apiKey) {
       console.warn("Chave da API TMDB_API_KEY ausente no .env");
       return { details: null, recommendations: [] };
    }

    const detailsUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=pt-BR&append_to_response=credits,videos`;
    const recUrl = `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${apiKey}&language=pt-BR&page=1`;

    const [resDetails, resRecs] = await Promise.all([
      fetch(detailsUrl),
      fetch(recUrl)
    ]);

    const details = resDetails.ok ? await resDetails.json() : null;
    const recData = resRecs.ok ? await resRecs.json() : { results: [] };

    return {
      details,
      recommendations: recData.results || []
    };
  } catch (error) {
    console.error(error);
    return { details: null, recommendations: [] };
  }
}

export async function fetchTrendingTrailers(query = '') {
  try {
    const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
    if (!apiKey) return [];

    let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=pt-BR`;
    if (query) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
    }
    
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    
    const trailerPromises = data.results.slice(0, 10).map(async (movie) => {
      try {
        const videoUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=pt-BR&include_video_language=pt-BR,en,en-US`;
        const videoRes = await fetch(videoUrl);
        if (!videoRes.ok) return null;
        const videoData = await videoRes.json();
        
        let trailerRaw = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (!trailerRaw) {
          trailerRaw = videoData.results.find(v => (v.type === 'Teaser' || v.type === 'Clip') && v.site === 'YouTube');
        }
        
        if (!trailerRaw) return null;
        
        return {
          id: trailerRaw.id,
          key: trailerRaw.key,
          name: trailerRaw.name,
          movieTitle: movie.title,
          thumbnailUrl: `https://img.youtube.com/vi/${trailerRaw.key}/maxresdefault.jpg`
        };
      } catch (err) {
        return null;
      }
    });

    const resolved = await Promise.all(trailerPromises);
    return resolved.filter(t => t !== null);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchPopularMoviesForQuiz() {
  try {
    const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
    if (!apiKey) return [];

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

import Parser from 'rss-parser';

const FEATURE_FLAGS = {
  USE_GOOGLE_NEWS: true,
  USE_NEWSAPI_FALLBACK: true,
  ALLOWED_SOURCES: {
    'Omelete': true,
    'AdoroCinema': true,
    'Jovem Nerd': true,
    'IGN Brasil': true,
    'Collider': true,
    'Variety': true
  }
};

const logger = {
  info: (event, details = {}) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'INFO', event, ...details }));
  },
  error: (event, error, details = {}) => {
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: 'ERROR', event, error: error?.message || String(error), ...details }));
  },
  warn: (event, details = {}) => {
    console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: 'WARN', event, ...details }));
  }
};
let newsCache = {
  data: null,
  lastFetch: 0
};
const CACHE_TTL_MS = 10 * 60 * 1000; 

function cleanHtmlTags(str) {
  if (!str) return '';
  return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

export async function fetchNews() {
  const now = Date.now();
  if (newsCache.data && (now - newsCache.lastFetch < CACHE_TTL_MS)) {
    logger.info('Cache_Hit', { source: 'in-memory', age_seconds: Math.round((now - newsCache.lastFetch) / 1000) });
    return newsCache.data;
  }

  const parser = new Parser({ timeout: 5000 });
  
  const activeDomains = Object.entries(FEATURE_FLAGS.ALLOWED_SOURCES)
    .filter(([_, isActive]) => isActive)
    .map(([source]) => {
      const mapping = {
        'Omelete': 'omelete.com.br',
        'AdoroCinema': 'adorocinema.com',
        'Jovem Nerd': 'jovemnerd.com.br',
        'IGN Brasil': 'br.ign.com',
        'Collider': 'collider.com',
        'Variety': 'variety.com'
      };
      return `site:${mapping[source] || source}`;
    }).join(' OR ');

  const feedUrls = [];
  if (FEATURE_FLAGS.USE_GOOGLE_NEWS) {
    if (activeDomains) {
      feedUrls.push(`https://news.google.com/rss/search?q=${encodeURIComponent(activeDomains)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`);
    }
    feedUrls.push(`https://news.google.com/rss/search?q=${encodeURIComponent('filme OR série OR cinema')}&hl=pt-BR&gl=BR&ceid=BR:pt-419`);
  }

  for (let i = 0; i < feedUrls.length; i++) {
    const url = feedUrls[i];
    try {
      logger.info('Fetch_RSS_Attempt', { step: i + 1, is_fallback: i > 0 });
      
      const feed = await parser.parseURL(url);
      
      if (!feed || !feed.items || feed.items.length === 0) {
        logger.warn('Fetch_RSS_Empty', { url });
        continue;
      }
      
      const articles = feed.items.map(item => {
        let sourceName = 'Desconhecida';
        let cleanTitle = item.title || 'Sem título';
        
        const lastDashIndex = cleanTitle.lastIndexOf('-');
        if (lastDashIndex > 0) {
          const extractedSource = cleanTitle.substring(lastDashIndex + 1).trim();
          cleanTitle = cleanTitle.substring(0, lastDashIndex).trim();
          
          const matchedSource = Object.keys(FEATURE_FLAGS.ALLOWED_SOURCES).find(
            allowed => extractedSource.toLowerCase().includes(allowed.toLowerCase())
          );
          
          sourceName = matchedSource || extractedSource;
        }

        let normalizedDate = new Date().toISOString();
        if (item.isoDate || item.pubDate) {
          const parsedDate = new Date(item.isoDate || item.pubDate);
          if (!isNaN(parsedDate.getTime())) normalizedDate = parsedDate.toISOString();
        }

        let normalizedDesc = cleanHtmlTags(item.contentSnippet || item.content || '');
        if (normalizedDesc.length > 150) normalizedDesc = normalizedDesc.substring(0, 147) + '...';

        return {
          title: cleanTitle,
          url: item.link || '',
          description: normalizedDesc,
          publishedAt: normalizedDate,
          source: { name: sourceName }
        };
      });

      if (articles.length > 0) {
        const finalArticles = articles.slice(0, 15);
        newsCache = { data: finalArticles, lastFetch: now };
        logger.info('Fetch_RSS_Success', { count: finalArticles.length });
        return finalArticles;
      }
    } catch (error) {
      logger.error('Fetch_RSS_Error', error, { step: i + 1, url });
    }
  }

  if (FEATURE_FLAGS.USE_NEWSAPI_FALLBACK) {
    try {
      logger.info('Fetch_NewsAPI_Fallback_Started');
      const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;
      if (apiKey) {
        const query = '(filme OR série OR movie OR series OR anime OR cinema)';
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${apiKey}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(newsApiUrl, { 
          cache: 'no-store', 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            const fallbackArticles = data.articles.map(item => ({
              title: item.title || 'Sem título',
              url: item.url || '',
              description: cleanHtmlTags(item.description || ''),
              publishedAt: item.publishedAt || new Date().toISOString(),
              source: { name: item.source?.name || 'NewsAPI Fallback' }
            })).slice(0, 15);

            newsCache = { data: fallbackArticles, lastFetch: now };
            logger.info('Fetch_NewsAPI_Fallback_Success', { count: fallbackArticles.length });
            return fallbackArticles;
          }
        }
      }
    } catch (apiError) {
      logger.error("Fetch_NewsAPI_Fallback_FatalError", apiError);
    }
  }

  logger.warn('All_News_Sources_Failed_Returning_Empty');
  return [];
}