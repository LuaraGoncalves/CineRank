const siteUrl = 'https://cineerank.netlify.app';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
