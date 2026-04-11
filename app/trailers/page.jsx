export default function Trailers() {
  return (
    <section id="trailers" aria-labelledby="trailers-title">
      <h2 id="trailers-title">Trailers em Destaque</h2>
      <div className="search-container active trailer-search-box" role="search" aria-label="Busca de trailers">
        <input type="text" id="trailer-search-input" placeholder="Pesquisar por trailer..." aria-label="Pesquisar trailers" />
        <button id="trailer-search-button" aria-label="Botão de pesquisa de trailers">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>
      <div className="carousel-container" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Trailers em breve. Conteúdo sendo migrado para React.</p>
      </div>
    </section>
  );
}
