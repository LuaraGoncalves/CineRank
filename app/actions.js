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

import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'watchlist.json');

async function initDB() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify([]));
  }
}

export async function getWatchlist() {
  try {
    await initDB();
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler watchlist:", error);
    return [];
  }
}

export async function toggleWatchlist(movie) {
  try {
    await initDB();
    const data = await fs.readFile(dbPath, 'utf-8');
    let watchlist = JSON.parse(data);
    
    const exists = watchlist.find(m => m.id === movie.id);
    let isAdded = false;

    if (exists) {
      watchlist = watchlist.filter(m => m.id !== movie.id);
    } else {
      watchlist.push(movie);
      isAdded = true;
    }

    await fs.writeFile(dbPath, JSON.stringify(watchlist, null, 2));
    return { success: true, isAdded };
  } catch (error) {
    console.error("Erro ao modificar watchlist:", error);
    return { success: false, error: error.message || "Erro desconhecido", stack: error.stack };
  }
}

export async function fetchNews() {
  try {
    const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;
    if (!apiKey) {
      console.warn("Chave da API de Notícias ausente no .env");
      return [];
    }
    
    const domains = 'omelete.com.br,adorocinema.com,jovemnerd.com.br,ign.com,collider.com,variety.com';
    const query = '(filme OR série OR movie OR series OR anime OR cinema)';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&domains=${domains}&sortBy=publishedAt&apiKey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.articles ? data.articles.slice(0, 15) : [];
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return [];
  }
}
