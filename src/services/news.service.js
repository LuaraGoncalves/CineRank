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

const NEWS_LIMIT = 30;
const NEWS_SOURCE_DOMAINS = {
    'Omelete': 'omelete.com.br',
    'AdoroCinema': 'adorocinema.com',
    'Jovem Nerd': 'jovemnerd.com.br',
    'IGN Brasil': 'br.ign.com',
    'Collider': 'collider.com',
    'Variety': 'variety.com'
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

function buildGoogleNewsFeedUrls() {
    const activeSources = Object.entries(FEATURE_FLAGS.ALLOWED_SOURCES)
        .filter(([_, isActive]) => isActive)
        .map(([source]) => ({
            source,
            domain: NEWS_SOURCE_DOMAINS[source] || source
        }));

    const feedUrls = [];
    if (FEATURE_FLAGS.USE_GOOGLE_NEWS) {
        activeSources.forEach(({ source, domain }) => {
            feedUrls.push({
                source,
                isFallback: false,
                url: `https://news.google.com/rss/search?q=${encodeURIComponent(`site:${domain}`)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
            });
        });

        feedUrls.push({
            source: 'Google News',
            isFallback: true,
            url: `https://news.google.com/rss/search?q=${encodeURIComponent('filme OR série OR cinema')}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
        });
    }

    return feedUrls;
}

function normalizeRssItem(item, preferredSourceName) {
    let sourceName = preferredSourceName || 'Desconhecida';
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
}

function dedupeArticles(articles) {
    const seen = new Set();
    return articles.filter(article => {
        const key = article.url || `${article.source.name}:${article.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function mixArticlesBySource(sourceResults, limit = NEWS_LIMIT) {
    const buckets = sourceResults
        .map(result => ({
            source: result.source,
            articles: dedupeArticles(result.articles || [])
        }))
        .filter(result => result.articles.length > 0);

    const mixedArticles = [];
    const seen = new Set();
    let hasMoreArticles = true;
    let articleIndex = 0;

    while (mixedArticles.length < limit && hasMoreArticles) {
        hasMoreArticles = false;

        for (const bucket of buckets) {
            const article = bucket.articles[articleIndex];
            if (!article) continue;

            hasMoreArticles = true;
            const key = article.url || `${article.source.name}:${article.title}`;
            if (seen.has(key)) continue;

            seen.add(key);
            mixedArticles.push(article);

            if (mixedArticles.length >= limit) break;
        }

        articleIndex += 1;
    }

    return mixedArticles;
}

async function fetchNewsApiFallback(now) {
    if (!FEATURE_FLAGS.USE_NEWSAPI_FALLBACK) return [];

    try {
        logger.info('Fetch_NewsAPI_Fallback_Started');
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) return [];

        const query = '(filme OR série OR movie OR series OR anime OR cinema)';
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${apiKey}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(newsApiUrl, {
            cache: 'no-store',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) return [];

        const data = await response.json();
        if (!data.articles?.length) return [];

        const fallbackArticles = data.articles.map(item => ({
            title: item.title || 'Sem título',
            url: item.url || '',
            description: cleanHtmlTags(item.description || ''),
            publishedAt: item.publishedAt || new Date().toISOString(),
            source: { name: item.source?.name || 'NewsAPI Fallback' }
        })).slice(0, NEWS_LIMIT);

        newsCache = { data: fallbackArticles, lastFetch: now };
        logger.info('Fetch_NewsAPI_Fallback_Success', { count: fallbackArticles.length });
        return fallbackArticles;
    } catch (apiError) {
        logger.error("Fetch_NewsAPI_Fallback_FatalError", apiError);
        return [];
    }
}

export async function fetchNews() {
    const now = Date.now();
    if (newsCache.data && (now - newsCache.lastFetch < CACHE_TTL_MS)) {
        logger.info('Cache_Hit', { source: 'in-memory', age_seconds: Math.round((now - newsCache.lastFetch) / 1000) });
        return newsCache.data;
    }

    const parser = new Parser({ timeout: 5000 });
    const feedUrls = buildGoogleNewsFeedUrls();
    const sourceResults = [];
    let fallbackResult = null;

    for (let i = 0; i < feedUrls.length; i++) {
        const feedConfig = feedUrls[i];
        try {
            logger.info('Fetch_RSS_Attempt', { step: i + 1, source: feedConfig.source, is_fallback: feedConfig.isFallback });

            const feed = await parser.parseURL(feedConfig.url);
            if (!feed?.items?.length) {
                logger.warn('Fetch_RSS_Empty', { source: feedConfig.source, url: feedConfig.url });
                continue;
            }

            const articles = feed.items.map(item => normalizeRssItem(item, feedConfig.source));
            if (articles.length > 0) {
                const result = {
                    source: feedConfig.source,
                    articles
                };

                if (feedConfig.isFallback) {
                    fallbackResult = result;
                } else {
                    sourceResults.push(result);
                }

                logger.info('Fetch_RSS_Source_Success', { source: feedConfig.source, count: articles.length });
            }
        } catch (error) {
            logger.error('Fetch_RSS_Error', error, { step: i + 1, source: feedConfig.source, url: feedConfig.url });
        }
    }

    const mixedArticles = mixArticlesBySource(sourceResults, NEWS_LIMIT);
    if (mixedArticles.length > 0) {
        newsCache = { data: mixedArticles, lastFetch: now };
        logger.info('Fetch_RSS_Mixed_Success', {
            count: mixedArticles.length,
            sources: sourceResults.map(result => result.source)
        });
        return mixedArticles;
    }

    if (fallbackResult?.articles?.length) {
        const fallbackArticles = dedupeArticles(fallbackResult.articles).slice(0, NEWS_LIMIT);
        newsCache = { data: fallbackArticles, lastFetch: now };
        logger.info('Fetch_RSS_Fallback_Success', { count: fallbackArticles.length });
        return fallbackArticles;
    }

    const fallbackArticles = await fetchNewsApiFallback(now);
    if (fallbackArticles.length > 0) return fallbackArticles;

    logger.warn('All_News_Sources_Failed_Returning_Empty');
    return [];
}
