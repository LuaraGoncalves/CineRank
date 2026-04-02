import { TmdbAPI } from '../../services/tmdb.service.js';
import { StorageService } from '../../core/storage.js';
import { getState, setState } from './quiz.state.js';

const TOTAL_QUESTIONS = 5;
const GENRE_MAP = {
    28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia", 80: "Crime", 
    99: "Documentário", 18: "Drama", 10751: "Família", 14: "Fantasia", 
    36: "História", 27: "Terror", 10402: "Música", 9648: "Mistério", 
    10749: "Romance", 878: "Ficção científica", 10770: "Cinema TV", 
    53: "Thriller", 10752: "Guerra", 37: "Faroeste"
};

export const QuizController = {
    async initialize() {
        const highScore = StorageService.getHighScore() || 0;
        setState({ highScore, screen: 'start' });
    },

    async startQuiz() {
        setState({ screen: 'loading', error: null });

        try {
            const data = await TmdbAPI.fetchPopularMoviesForQuiz();
            const moviesWithSynopsis = data.results.filter(m => m.overview).sort(() => 0.5 - Math.random());

            if (moviesWithSynopsis.length < 4) {
                setState({ screen: 'game', error: 'Não há filmes suficientes para o quiz.' });
                return;
            }

            const questions = [];
            const allMovies = [...moviesWithSynopsis];

            for (let i = 0; i < TOTAL_QUESTIONS && i < allMovies.length; i++) {
                const correctMovie = allMovies[i];
                const otherOptions = allMovies.filter(m => m.id !== correctMovie.id).sort(() => 0.5 - Math.random()).slice(0, 3);
                
                if (otherOptions.length < 3) continue;

                const options = [correctMovie, ...otherOptions].sort(() => 0.5 - Math.random());
                
                questions.push({
                    synopsis: correctMovie.overview,
                    options: options.map(m => m.title),
                    correctAnswer: correctMovie.title,
                    genres: correctMovie.genre_ids
                });
            }

            if (questions.length === 0) {
                setState({ screen: 'game', error: 'Não foi possível gerar as perguntas.' });
                return;
            }

            setState({
                screen: 'game',
                questions,
                currentQuestionIndex: 0,
                score: 0,
                genreScores: {},
                selectedAnswer: null,
                feedback: null,
                error: null
            });
        } catch (error) {
            console.error('Erro ao gerar perguntas do quiz:', error);
            setState({ screen: 'game', error: 'Erro ao carregar o quiz.' });
        }
    },

    selectAnswer(selectedOption) {
        const state = getState();
        if (state.selectedAnswer) return;

        const question = state.questions[state.currentQuestionIndex];
        const isCorrect = selectedOption === question.correctAnswer;
        
        let newScore = state.score;
        let newGenreScores = { ...state.genreScores };

        if (isCorrect) {
            newScore++;
            if (question.genres) {
                question.genres.forEach(id => {
                    if (GENRE_MAP[id]) {
                        newGenreScores[GENRE_MAP[id]] = (newGenreScores[GENRE_MAP[id]] || 0) + 1;
                    }
                });
            }
        }

        setState({
            selectedAnswer: selectedOption,
            score: newScore,
            genreScores: newGenreScores,
            feedback: {
                isCorrect,
                text: isCorrect ? 'Resposta Correta!' : `Incorreto! A resposta era: ${question.correctAnswer}`
            }
        });
    },

    nextQuestion() {
        const state = getState();
        const nextIndex = state.currentQuestionIndex + 1;

        if (nextIndex < state.questions.length) {
            setState({
                currentQuestionIndex: nextIndex,
                selectedAnswer: null,
                feedback: null
            });
        } else {
            this.endQuiz();
        }
    },

    endQuiz() {
        const state = getState();
        let newHighScore = state.highScore;

        if (state.score > state.highScore) {
            StorageService.setHighScore(state.score);
            newHighScore = state.score;
        }

        setState({
            screen: 'end',
            highScore: newHighScore
        });
    }
};