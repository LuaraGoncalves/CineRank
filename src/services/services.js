import { config } from '../core/config.js';
import { request } from '../core/http.js';

export const NewsAPI = {
    async fetchNews() {
        const query = config.newsApi.query;
        const domains = config.newsApi.domains;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&domains=${domains}&sortBy=publishedAt&apiKey=${config.newsApi.apiKey}`;

        return await request(url);
    }
};

export const TranslationAPI = {
    async translate(text) {
        if (!text) return text;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt-br`;
        const data = await request(url);
        return data.responseData.translatedText;
    }
};
