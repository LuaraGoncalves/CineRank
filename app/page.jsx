import Dashboard from './components/Dashboard';

// Função que roda no servidor (SSR/SSG)
async function getTrendingMovies() {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) return [];

    // Usando a rota de trending para preencher a Home
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=pt-BR&page=1`,
      {
        next: { revalidate: 3600 } // ISR: Revalida a cada 1 hora
      }
    );

    if (!res.ok) throw new Error('Falha ao buscar filmes');
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const movies = await getTrendingMovies();

  return (
    <>
      <Dashboard initialMovies={movies} />
    </>
  );
}
