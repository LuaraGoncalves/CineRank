import '../src/styles/main.css';

const siteUrl = 'https://cineerank.netlify.app';
const siteName = 'CineRank';
const siteDescription =
  'Descubra filmes e séries, veja trailers, acompanhe notícias do cinema e salve seus favoritos em uma experiência moderna com Next.js.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: 'CineRank - Filmes, séries, trailers e notícias',
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: [
    'CineRank',
    'filmes',
    'séries',
    'trailers',
    'notícias de cinema',
    'TMDB',
    'quiz de filmes',
    'favoritos'
  ],
  authors: [{ name: 'Luara Gonçalves' }],
  creator: 'Luara Gonçalves',
  publisher: 'Luara Gonçalves',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName,
    title: 'CineRank - Filmes, séries, trailers e notícias',
    description: siteDescription,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'CineRank - descubra filmes, séries, trailers e notícias'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineRank - Filmes, séries, trailers e notícias',
    description: siteDescription,
    images: ['/twitter-image']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

import Header from './components/Header';
import Footer from './components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
