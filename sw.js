const CACHE_NAME = 'cinerank-v2'; // Bumped version to force activation
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/src/styles/main.css',
    '/src/styles/base/base.css',
    '/src/styles/layout/layout.css',
    '/src/styles/components/components.css',
    '/src/styles/utilities/utilities.css',
    '/src/app/main.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Utilizamos catch para evitar que um erro de 404 de algum asset quebre o install do SW
            return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn('Cache de assets parcialmente falhou', err));
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Ignorar requisições não GET (ex: POST, PUT, DELETE)
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);

    // Ignorar esquemas estranhos como chrome-extension:// ou ws:// (Vite HMR)
    if (!url.protocol.startsWith('http')) return;

    // Ignorar requisições internas do servidor de dev do Vite para não quebrar o HMR
    if (url.pathname.includes('@vite') || url.pathname.includes('.vite')) return;

    // NetworkFirst para requisições na API externa
    if (url.origin === 'https://api.themoviedb.org' || url.origin === 'https://newsapi.org') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return response;
                })
                .catch(() => caches.match(event.request).then(res => {
                    // Retorna do cache se tiver, ou falha amigavelmente
                    return res || new Response(JSON.stringify({ error: 'Offline' }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }))
        );
        return;
    }

    // CacheFirst para os Assets Locais da Aplicação
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Retorna do cache
            }

            return fetch(event.request).then((fetchResponse) => {
                // Não faça cache de respostas opacas ou erros para evitar "Response inválido"
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }

                // Clona a resposta para colocar no cache
                const responseToCache = fetchResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return fetchResponse;
            });
        }).catch(() => {
            // Em caso extremo de offline sem cache disponível para assets
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html').then(res => {
                    return res || new Response('Aplicação Offline', { status: 503 });
                });
            }
            return new Response('Recurso Indisponível', { status: 503 });
        })
    );
});