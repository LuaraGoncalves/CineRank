export const config = {
    tmdb: {
        apiKey: import.meta.env.VITE_TMDB_API_KEY,
        baseUrl: 'https://api.themoviedb.org/3',
        imgUrl: 'https://image.tmdb.org/t/p/w500'
    },
    newsApi: {
        apiKey: import.meta.env.VITE_NEWS_API_KEY,
        domains: 'omelete.com.br,adorocinema.com,jovemnerd.com.br,ign.com,collider.com,variety.com',
        query: '(filme OR série OR movie OR series OR anime OR cinema)'
    }
};
