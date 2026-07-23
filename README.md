# CineRank

CineRank e uma aplicacao Next.js para descobrir filmes, series, trailers e noticias do universo audiovisual. O projeto usa APIs externas para buscar conteudos, renderizacao hibrida do Next.js e persistencia local no navegador para favoritos e preferencias.

## Tecnologias

- Next.js 16 com App Router
- React 19
- CSS puro modularizado
- Server Components e Server Actions
- TMDB API para filmes, series, detalhes, quiz e trailers, com cliente e normalizacao centralizados
- Google News RSS e NewsAPI combinados como fontes de noticias
- Jest para testes
- ESLint e Prettier para qualidade e formatacao
- Netlify para deploy

## Funcionalidades

- Dashboard com filmes e series em destaque
- Filtros por tipo, genero, ano e classificacao
- Busca global no cabecalho com sugestoes enquanto a pessoa digita
- Pagina de detalhes com sinopse, nota, generos, diretor/criador e recomendacoes
- Lista de favoritos persistida com `localStorage`
- Quiz com perguntas geradas a partir de filmes populares do TMDB
- Trailers com carregamento progressivo via botao "Ver mais"
- Noticias misturadas entre fontes nacionais, internacionais, Google News RSS e NewsAPI
- Traducao manual de noticias quando necessario
- Tema claro/escuro salvo localmente

## Estrutura

```txt
app/
  Rotas, Server Actions e componentes da aplicacao Next.js.

src/services/
  Camada de acesso a APIs externas como TMDB, noticias e trailers.
  Inclui cliente TMDB centralizado e normalizadores de dados.

src/hooks/
  Hooks com regras de interface para busca, notificacoes e quiz.

src/repositories/
  Camada de acesso a dados da aplicacao. Hoje a watchlist usa persistencia local,
  mas fica isolada para futura sincronizacao com autenticacao e banco.

src/core/
  Constantes e armazenamento local do navegador.

src/styles/
  CSS global dividido por base, layout, componentes e utilitarios.

src/utils/
  Funcoes utilitarias e testes simples.
```

## Rotas

- `/` - Dashboard principal
- `/filme/[id]` - Detalhes de filme ou serie
- `/watchlist` - Favoritos salvos no navegador
- `/quiz` - Quiz interativo
- `/trailers` - Busca e listagem de trailers

## Variaveis de Ambiente

Crie um arquivo `.env` na raiz seguindo o modelo de `.env.example`.

```txt
TMDB_API_KEY=SuaChaveDaAPI_Aqui
NEWS_API_KEY=SuaChaveDaAPI_Aqui
```

`TMDB_API_KEY` e obrigatoria para filmes, series, quiz e trailers.

`NEWS_API_KEY` e opcional para noticias. Quando configurada, ela complementa as noticias do Google News RSS e ajuda a aumentar a quantidade de resultados recentes.

## Como Rodar Localmente

```bash
npm install
npm run dev
```

Depois acesse:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format:check
npm run format
npm test
```

## Deploy

O projeto esta configurado para Netlify via `netlify.toml`.

Config atual:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

No painel da Netlify, configure as variaveis:

- `TMDB_API_KEY`
- `NEWS_API_KEY`

## Observacoes Importantes

- Favoritos ainda nao usam banco real. Eles ficam no navegador da pessoa via `localStorage`, acessados por uma camada de repositorio local.
- Para sincronizar favoritos entre dispositivos, o proximo passo seria trocar o repositorio local por uma implementacao com autenticacao e banco, como Supabase.
- A traducao de noticias e manual: a pessoa precisa clicar no icone de globo.
- As noticias dependem de cache em memoria e de fontes externas; a quantidade de noticias recentes pode variar conforme Google News, NewsAPI e limites das APIs.
- O projeto depende de APIs externas, entao dados podem variar conforme disponibilidade e limites dessas APIs.
