export const TmdbAdapter = {
    adaptMovie(item, defaultType = 'movie') {
        const title = item.title || item.name || 'Título Indisponível';
        const date = item.release_date || item.first_air_date;
        const year = date ? date.split('-')[0] : 'N/A';
        const type = item.media_type || defaultType;
        const imgUrl = 'https://image.tmdb.org/t/p/w500';
        
        const fallbackImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750" fill="%232c2c2c"><rect width="500" height="750"/><text x="50%" y="50%" fill="%23ffffff" font-size="30" font-family="sans-serif" text-anchor="middle" dy=".3em">Sem Imagem</text></svg>';

        return {
            id: item.id,
            title: title,
            year: year,
            type: type,
            image: item.poster_path ? imgUrl + item.poster_path : fallbackImg,
            rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
            rawIds: item.genre_ids || [],
            overview: item.overview || 'Sinopse não disponível.'
        };
    },

    adaptDetails(item, defaultType = 'movie') {
        const base = this.adaptMovie(item, defaultType);
        
        let trailerKey = null;
        if (item.videos && item.videos.results) {
            const trailer = item.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) trailerKey = trailer.key;
        }

        return {
            ...base,
            genres: item.genres ? item.genres.map(g => g.name) : [],
            cast: item.credits && item.credits.cast ? item.credits.cast.slice(0, 5).map(c => c.name) : [],
            trailerKey: trailerKey
        };
    },

    adaptTrailer(item) {
        return {
            key: item.key,
            name: item.name
        };
    }
};
