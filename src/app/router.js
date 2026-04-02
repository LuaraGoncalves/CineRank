import { ROUTES } from '../core/constants.js';

export const Router = {
    routes: [],
    globalMiddlewares: [],

    use(middleware) {
        this.globalMiddlewares.push(middleware);
    },

    addRoute({ pattern, action, lazyLoad, sectionId, middlewares = [] }) {
        this.routes.push({
            pattern: new RegExp('^' + pattern.replace(/:\w+/g, '([^\\/]+)') + '$'),
            originalPattern: pattern,
            action,
            lazyLoad,
            sectionId,
            middlewares,
            isLoaded: false
        });
    },

    init(sections, navLinks, context) {
        const handleRoute = async () => {
            let hash = window.location.hash.replace(/^#\//, '');
            if (!hash) hash = 'dashboard';
            
            let matchedRoute = null;
            let routeParams = [];

            for (let route of this.routes) {
                const match = hash.match(route.pattern);
                if (match) {
                    matchedRoute = route;
                    routeParams = match.slice(1);
                    break;
                }
            }

            if (matchedRoute) {
                
                for (const middleware of this.globalMiddlewares) {
                    const result = await middleware(context, hash);
                    if (result === false) return; 
                }


                for (const middleware of matchedRoute.middlewares) {
                    const result = await middleware(context, hash, ...routeParams);
                    if (result === false) return; 
                }

              
                if (matchedRoute.sectionId) {
                    sections.forEach(section => {
                        section.style.display = section.id === matchedRoute.sectionId ? 'block' : 'none';
                    });
                    
                    navLinks.forEach(l => {
                        l.classList.remove('active');
                        if (l.getAttribute('href') === `/#/${matchedRoute.sectionId}`) {
                            l.classList.add('active');
                        }
                    });
                }
                
               
                try {
                    if (matchedRoute.lazyLoad && !matchedRoute.isLoaded) {
                       
                        const module = await matchedRoute.lazyLoad();
                        matchedRoute.module = module;
                        matchedRoute.isLoaded = true;
                    }

                 
                    if (matchedRoute.action) {
                        await matchedRoute.action(context, matchedRoute.module, ...routeParams);
                    }
                } catch (error) {
                    console.error(`Erro ao carregar a rota [${hash}]:`, error);
                }
            } else {
                console.warn(`Rota não encontrada: ${hash}`);
                window.location.hash = '/dashboard';
            }
        };

        window.addEventListener('hashchange', handleRoute);


        this.use(async (ctx, hash) => {
            console.log(`[Router] Navegando para: ${hash}`);
            return true;
        });
        this.addRoute({
            pattern: ROUTES.HOME,
            sectionId: 'dashboard',
            action: () => {}
        });

        this.addRoute({
            pattern: ROUTES.WATCHLIST,
            sectionId: 'watchlist',
            action: (ctx) => ctx && ctx.loadWatchlist && ctx.loadWatchlist()
        });


        const requireAuth = async (ctx, hash) => {
            const isAuthenticated = true; 
            if (!isAuthenticated) {
                console.warn('[Router] Acesso negado. Redirecionando para login...');
                window.location.hash = '/login';
                return false;
            }
            return true;
        };

    
        this.addRoute({
            pattern: ROUTES.QUIZ,
            sectionId: 'quiz',
            middlewares: [requireAuth],
            lazyLoad: () => import('../features/quiz/quiz.controller.js').then(c => c).then(async controller => {
                const view = await import('../features/quiz/quiz.view.js');
                const state = await import('../features/quiz/quiz.state.js');
                return { controller: controller.QuizController, view: view.QuizView, state };
            }),
            action: async (ctx, module) => {
                if (module && !module._initialized) {
                    module.view.init();
                    module.state.subscribe((state) => {
                        module.view.render(state);
                    });
                    module.controller.initialize();
                    module._initialized = true;
                }
            }
        });

        this.addRoute({
            pattern: ROUTES.TRAILERS,
            sectionId: 'trailers',
            action: (ctx) => ctx && ctx.loadTrailers && ctx.loadTrailers()
        });
        
        this.addRoute({
            pattern: ROUTES.MOVIE_DETAILS,
            action: async (ctx, module, id) => {
                if (ctx && ctx.showDetails) {
                    await ctx.showDetails(id, 'movie');
                }
            }
        });

        this.addRoute({
            pattern: ROUTES.TV_DETAILS,
            action: async (ctx, module, id) => {
                if (ctx && ctx.showDetails) {
                    await ctx.showDetails(id, 'tv');
                }
            }
        });

        handleRoute();
    }
};