# CineRank

O CineRank e uma plataforma hibrida de catalogo de filmes, series e curiosidades, projetada com a arquitetura do Next.js (App Router). O sistema fornece detalhes aprofundados sobre conteudos do The Movie Database (TMDB), interacoes dinamicas no dashboard, um sistema de quiz interativo, sessoes de noticias atualizadas e capacidade de os usuarios salvarem suas obras favoritas com persistencia local no navegador.

## Tecnologias e Arquitetura

O projeto abandonou abordagens puramente estaticas e de Client-Side Rendering em prol de tecnicas de renderizacao hibridas otimizadas providas pelo Next.js.

- Framework: Next.js 16+ (React 19+)
- Estilizacao: CSS puro centralizado (herdado do Vanilla CSS para reaproveitamento nativo)
- Manipulacao de Dados: Server Components, Server Actions e fetch caching nativo do Next.js.
- APIs Externas Integradas: TMDB API (The Movie Database), NewsAPI.

### Abordagens de Renderizacao (Hibridas)

- Server-Side Rendering (SSR) e Client-Side Rendering (CSR): A Home Page (`/`) renderiza o estado inicial no servidor e o componente `Dashboard` assume no cliente as interacoes complexas de filtros e infinite scroll.
- Incremental Static Regeneration (ISR): A rota detalhada dos titulos (`/filme/[id]`) opera atraves de ISR (`revalidate: 3600`) para reduzir chamadas repetidas a API externa e manter os detalhes atualizados em janelas regulares.

### Estrutura de Rotas (App Router)

- `/` - Home Page e Dashboard com scroll infinito.
- `/filme/[id]` - Rota dinamica de detalhes da obra e recomendacoes.
- `/watchlist` - Lista de favoritos sincronizada com a persistencia no backend local.
- `/quiz` - Sistema interativo de perguntas e respostas renderizado pelo lado do cliente.
- `/trailers` - Interface com as promessas de novos trailers integrados ao TMDB.

## Configuracao de Ambiente

Para executar este projeto localmente, crie um arquivo `.env` na raiz do diretorio espelhando o `.env.example`.

Obrigatorios:
- TMDB_API_KEY: Chave de acesso fornecida na documentacao de desenvolvedores do The Movie Database (TMDB).
- NEWS_API_KEY: Chave de acesso fornecida pela plataforma NewsAPI (newsapi.org).

## Instalacao e Execucao Local

1. Certifique-se de possuir o Node.js na sua maquina (recomenda-se a versao LTS atual).
2. Clone o repositorio.
3. Instale as dependencias executando: `npm install`
4. Inicie o servidor de desenvolvimento: `npm run dev`
5. Acesse http://localhost:3000

## Deploy

Este repositorio funciona bem em Vercel e em outras hospedagens compatíveis com Next.js. A Vercel costuma ser a opcao mais simples por exigir menos configuracao para rotas do App Router e Server Actions.

Para publicar:
1. Conecte sua conta do GitHub a Vercel.
2. Importe o repositorio do CineRank.
3. Adicione suas chaves do `.env` na sessao de "Environment Variables" da Vercel.
4. Execute o Deploy.
