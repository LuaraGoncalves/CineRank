# CineRank

**CineRank** é uma aplicação Single Page Application (SPA) de alto nível construída **100% em Vanilla JavaScript, HTML5 e CSS3**. 

O objetivo deste projeto não é apenas consumir a API do TMDB (The Movie Database), mas provar que é possível criar uma arquitetura moderna, escalável, performática e segura — com padrões dignos de grandes frameworks como React ou Angular — **sem usar nenhuma biblioteca externa para a UI**.

---

##  Telas do Sistema (Placeholders)

<div align="center">
  <img src="https://via.placeholder.com/800x450?text=CineRank+-+Dashboard+Principal" alt="Dashboard Principal" width="48%" />
  <img src="https://via.placeholder.com/800x450?text=CineRank+-+Modal+de+Detalhes+e+Recomenda%C3%A7%C3%B5es" alt="Modal de Detalhes" width="48%" />
</div>
<div align="center">
  <img src="https://via.placeholder.com/800x450?text=CineRank+-+Quiz+Interativo" alt="Quiz Interativo" width="48%" />
  <img src="https://via.placeholder.com/800x450?text=CineRank+-+Design+Responsivo+Mobile" alt="Design Mobile" width="48%" />
</div>

---

##  Arquitetura e Fluxo de Dados (MVC + State Management)

O sistema foi desenhado com uma **Arquitetura Baseada em Funcionalidades (Feature-Based)**, com separação estrita de responsabilidades. O fluxo de dados é unidirecional e previsível, inspirado na arquitetura Flux/Redux.

### O Fluxo: `Ação do Usuário ➔ Controller ➔ State ➔ View`

1. **State Centralizado (Single Source of Truth)**:
   - Implementado o padrão **Factory** e **Observer** em um State Manager customizado (`src/core/store.js`).
   - Todos os dados (listas, inputs, pontuação do quiz, erros) residem em um único objeto de estado.
2. **Controller (Orquestrador)**:
   - Ouve as intenções do usuário (via `events.js`) e regras de negócio.
   - Faz chamadas à API, lida com a lógica e dispara um `setState({...})`. **Ele nunca toca no DOM.**
3. **View (Declarativa)**:
   - Ouve as alterações do State (`subscribe`) e "reage" atualizando o DOM cirurgicamente usando `textContent` ou recriando nós. Não guarda nenhum estado interno.

---

##  Decisões Técnicas e Design Patterns

### Segurança (Anti-XSS)
- **Sem `innerHTML` cego**: O uso de `.innerHTML` para injetar dados do usuário foi erradicado. 
- Implementado um utilitário universal de sanitização de DOM (`src/utils/dom.js`) e uso forte da API nativa `.textContent` e `document.createElement()` para garantir que payloads maliciosos sejam tratados como strings seguras.

###  Performance Extrema
- **Lazy Loading Genuíno**: Páginas como o `Quiz` e modais pesados não são enviados no bundle inicial. O roteador usa `import()` dinâmico para baixar os scripts (Code Splitting) apenas quando a rota for acessada.
- **Lazy Loading Nativo de Imagens**: O uso do atributo `loading="lazy"` nas capas dos filmes poupa banda massivamente nas listagens longas.
- **Debounce**: Prevenção de gargalos de rede através de *Debounce* customizado ao digitar na barra de pesquisa.

### Client HTTP Profissional e Serverless BFF
- A camada de rede não usa o Fetch solto nem bibliotecas pesadas como o *Axios*.
- Criei uma classe genérica (`src/core/http.js`) que implementa **Interceptors de Request e Response**. Graças a isso, a tratativa de erros globais com Toasts de notificação é feita centralmente em apenas um lugar, desacoplando a UI da infraestrutura HTTP.
- **Backend-for-Frontend (Serverless)**: Como a `NewsAPI` bloqueia requisições em ambiente client-side (CORS/segurança de API Key), implementamos um backend leve usando as **Netlify Functions** (`netlify/functions/news.js`). O Client consome apenas a nossa rota proxy interna, e a nossa Lambda trata a segurança e injeção da secret key longe do front-end!

### CSS System (Mobile-First)
- **Zero Frameworks de CSS**: Nada de Bootstrap ou Tailwind! Mas as melhores práticas estão aqui.
- **Design Tokens**: Cores, espaçamentos e tipografia mapeados no `:root` via CSS Variables no `base.css`.
- **Classes Utilitárias (Mini-Tailwind)**: Criei um gerador de utilitários em `utilities.css` (`.flex`, `.justify-between`, `.p-4`, `.text-center`, etc) permitindo prototipação visual diretamente nas classes do DOM.
- **Grids Fluidos**: O layout ajusta suas colunas nativamente usando `grid-template-columns: repeat(auto-fill, minmax(...))` ao invés de breakpoints fixos quebrados.

### Testes Automatizados (Jest)
- Para garantir que regras core e transformações de dados de terceiros não quebrem o app silenciosamente, implementei **Testes Unitários com Jest** (`npm test`).
- Testamos os adaptadores DTO (Data Transfer Objects) e as funções puras de manipulação de DOM/Strings de ponta a ponta.

---

##  Roteamento de Rota Nativo (Router Avançado)

Construí um roteador (SPA) em `router.js` que utiliza a *History API / Hash* e fornece recursos avançados de frameworks robustos:
- **Middlewares / Route Guards**: Suporte para validar permissões antes de exibir a página.
- **Ciclo de vida assíncrono**: Roda `middlewares` globais e específicos -> injeta `Lazy Loading` -> Roda `Actions` de montagem da tela.

---

## Como Instalar e Rodar

### Pré-requisitos
- Node.js instalado (v18+)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/LuaraGoncalves/CineRank.git
   cd CineRank
   ```

2. **Instale as dependências** (usamos o Vite apenas como dev-server e bundler):
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz, copiando a estrutura do `.env.example`:
   ```env
   VITE_TMDB_API_KEY=sua_chave_do_tmdb_aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará rodando em `http://localhost:5173`.

5. **Para rodar os Testes Unitários:**
   ```bash
   npm run test
   ```

---

Feito com ☕ e muito Vanilla JS.