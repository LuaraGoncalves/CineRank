import Link from 'next/link';
import NotificationModal from './NotificationModal';
import SearchBox from './SearchBox';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header>
      <nav aria-label="Menu de Navegação Principal">
        <Link href="/" aria-label="Ir para Início">
          Inicio
        </Link>
        <Link href="/watchlist" aria-label="Ir para Minha Lista de Favoritos">
          Minha Lista
        </Link>
        <Link href="/quiz" aria-label="Ir para o Quiz Interativo">
          Quiz
        </Link>
        <Link
          href="/trailers"
          aria-label="Ir para a sessão de Trailers em Destaque"
        >
          Trailers
        </Link>
      </nav>
      <div className="header-actions">
        <SearchBox />
        <ThemeToggle />
        <NotificationModal />
      </div>
    </header>
  );
}
