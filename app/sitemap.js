const siteUrl = 'https://cineerank.netlify.app';

export default function sitemap() {
  const routes = ['/', '/trailers', '/quiz', '/watchlist'];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7
  }));
}
