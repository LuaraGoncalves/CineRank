export const config = {
    tmdb: {
        apiKey: import.meta.env.VITE_TMDB_API_KEY,
        baseUrl: 'https://api.themoviedb.org/3',
        imgUrl: 'https://image.tmdb.org/t/p/w500'
    },
    newsApi: {
        baseUrl: '/.netlify/functions/news'
    }
};
