import '../src/styles/main.css';

export const metadata = {
  title: 'CineRank - Filmes, séries, trailers e notícias',
  description:
    'Descubra filmes e séries, veja trailers, acompanhe notícias e salve favoritos.'
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
