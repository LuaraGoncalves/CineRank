'use client';

import { useEffect, useState } from 'react';
import { fetchPopularMoviesForQuiz } from '../actions';
import { StorageService } from '../../src/core/storage.js';

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
  return [...items].sort(() => Math.random() - 0.5);
}

function buildQuestions(movies) {
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

export default function Quiz() {
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
        const movies = await fetchPopularMoviesForQuiz();
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
  }, [gameState]);

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
          if (genreName)
            nextScores[genreName] = (nextScores[genreName] || 0) + 1;
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

  const currentQuestion = questions[currentQuestionIndex];
  const finalScore = score;
  const personality = getPersonality(genreScores);

  return (
    <section id="quiz" aria-labelledby="quiz-title">
      <h2 id="quiz-title">Quiz de Filmes e Séries</h2>
      <div id="quiz-container" role="region" aria-label="Área do Quiz">
        {gameState === 'start' && (
          <div id="quiz-start-screen">
            <p>Teste seus conhecimentos sobre filmes e séries!</p>
            {error && <p className="error-message">{error}</p>}
            <button id="start-quiz-btn" onClick={startQuiz}>
              Começar Quiz
            </button>
          </div>
        )}

        {gameState === 'loading' && (
          <div id="quiz-loading-screen">
            <div className="loading-spinner-container quiz-loading-state">
              <div className="spinner"></div>
              <p>Gerando perguntas...</p>
            </div>
          </div>
        )}

        {gameState === 'game' && currentQuestion && (
          <div id="quiz-game-screen">
            <p id="quiz-progress">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </p>
            <div id="quiz-question">Qual é o filme desta sinopse?</div>
            <p className="quiz-synopsis">{currentQuestion.synopsis}</p>
            <div id="quiz-options" className="quiz-options">
              {currentQuestion.options.map((option) => {
                const isCorrect =
                  selectedAnswer && option === currentQuestion.correctAnswer;
                const isIncorrect =
                  selectedAnswer === option &&
                  option !== currentQuestion.correctAnswer;
                return (
                  <button
                    key={option}
                    className={`quiz-option ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                    disabled={Boolean(selectedAnswer)}
                    onClick={() => selectAnswer(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <p id="quiz-feedback">{feedback}</p>
            {selectedAnswer && (
              <button id="next-question-btn" onClick={nextQuestion}>
                {currentQuestionIndex + 1 >= questions.length
                  ? 'Finalizar Quiz'
                  : 'Próxima Pergunta'}
              </button>
            )}
          </div>
        )}

        {gameState === 'end' && (
          <div id="quiz-end-screen">
            <h3>Quiz Finalizado!</h3>
            <p>
              Sua pontuação: <span id="final-score">{finalScore}</span>
            </p>
            <p id="quiz-personality-result" className="quiz-personality-result">
              {personality}
            </p>
            <p>
              Recorde:{' '}
              <span id="high-score">{Math.max(highScore, finalScore)}</span>
            </p>
            <button id="restart-quiz-btn" onClick={restartQuiz}>
              Jogar Novamente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
