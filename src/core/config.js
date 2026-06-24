export const config = {
    tmdb: {
        apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY,
        baseUrl: 'https://api.themoviedb.org/3',
        imgUrl: 'https://image.tmdb.org/t/p/w500'
    },
    newsApi: {
        baseUrl: '/.netlify/functions/news'
    }
};
