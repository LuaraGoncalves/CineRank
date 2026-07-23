import { useEffect, useState } from 'react';
import { StorageService } from '../core/storage.js';

const TOTAL_QUESTIONS = 5;
const OPTIONS_PER_QUESTION = 4;
const GENRE_MAP = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção científica',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Faroeste'
};

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index]
    ];
  }

  return shuffled;
}

export function buildQuestions(movies) {
  const moviesWithSynopsis = shuffle(
    movies.filter((movie) => movie.title && movie.overview)
  );

  return moviesWithSynopsis.reduce((questions, correctMovie) => {
    if (questions.length >= TOTAL_QUESTIONS) return questions;

    const wrongOptions = shuffle(
      moviesWithSynopsis.filter((movie) => movie.id !== correctMovie.id)
    ).slice(0, OPTIONS_PER_QUESTION - 1);

    if (wrongOptions.length < OPTIONS_PER_QUESTION - 1) return questions;

    const options = shuffle([correctMovie, ...wrongOptions]).map(
      (movie) => movie.title
    );

    questions.push({
      id: correctMovie.id,
      synopsis: correctMovie.overview,
      correctAnswer: correctMovie.title,
      options,
      genres: correctMovie.genre_ids || []
    });

    return questions;
  }, []);
}

function getPersonality(genreScores) {
  const [topGenre] =
    Object.entries(genreScores).sort((a, b) => b[1] - a[1])[0] || [];
  if (!topGenre) return 'Cinéfilo Curioso!';
  return `Especialista em ${topGenre}!`;
}

export function useQuizGame(fetchPopularMoviesForQuizFn) {
  const [gameState, setGameState] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [genreScores, setGenreScores] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    setHighScore(StorageService.getHighScore());
  }, []);

  useEffect(() => {
    if (gameState !== 'loading') return;

    async function loadQuestions() {
      try {
        const movies = await fetchPopularMoviesForQuizFn();
        const generatedQuestions = buildQuestions(movies);

        if (generatedQuestions.length === 0) {
          setError(
            'Não foi possível gerar perguntas agora. Tente novamente em instantes.'
          );
          setGameState('start');
          return;
        }

        setQuestions(generatedQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setScore(0);
        setGenreScores({});
        setError('');
        setGameState('game');
      } catch {
        setError('Erro ao carregar o quiz. Tente novamente em instantes.');
        setGameState('start');
      }
    }

    loadQuestions();
  }, [fetchPopularMoviesForQuizFn, gameState]);

  const startQuiz = () => {
    setError('');
    setGameState('loading');
  };

  const selectAnswer = (option) => {
    if (selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;

    setSelectedAnswer(option);
    setFeedback(
      isCorrect
        ? 'Resposta correta!'
        : `Incorreto! A resposta era: ${currentQuestion.correctAnswer}`
    );

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setGenreScores((prev) => {
        const nextScores = { ...prev };
        currentQuestion.genres.forEach((id) => {
          const genreName = GENRE_MAP[id];
          if (genreName) {
            nextScores[genreName] = (nextScores[genreName] || 0) + 1;
          }
        });
        return nextScores;
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      const finalScore = score;
      if (finalScore > highScore) {
        StorageService.setHighScore(finalScore);
        setHighScore(finalScore);
      }
      setGameState('end');
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const restartQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setScore(0);
    setGenreScores({});
    setGameState('start');
  };

  return {
    gameState,
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    selectedAnswer,
    feedback,
    score,
    highScore,
    finalScore: score,
    personality: getPersonality(genreScores),
    error,
    startQuiz,
    selectAnswer,
    nextQuestion,
    restartQuiz
  };
}
