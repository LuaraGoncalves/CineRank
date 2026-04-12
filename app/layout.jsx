import '../src/styles/main.css';

export const metadata = {
  title: 'CineRank - Next.js',
  description: 'App de filmes com busca, quiz e recomendações',
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
