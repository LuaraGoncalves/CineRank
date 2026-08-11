'use client';

import { fetchPopularMoviesForQuizResult } from '../actions';
import FeedbackState from '../components/FeedbackState';
import { useQuizGame } from '../../src/hooks/useQuizGame.js';

export default function Quiz() {
  const {
    gameState,
    questions,
    currentQuestionIndex,
    currentQuestion,
    selectedAnswer,
    feedback,
    highScore,
    finalScore,
    personality,
    error,
    startQuiz,
    selectAnswer,
    nextQuestion,
    restartQuiz
  } = useQuizGame(fetchPopularMoviesForQuizResult);

  return (
    <section id="quiz" aria-labelledby="quiz-title">
      <h2 id="quiz-title">Quiz de Filmes e Séries</h2>
      <div id="quiz-container" role="region" aria-label="Área do Quiz">
        {gameState === 'start' && (
          <div id="quiz-start-screen">
            <p>Teste seus conhecimentos sobre filmes e séries!</p>
            {error && (
              <FeedbackState
                variant="error"
                title="Não conseguimos preparar o quiz"
                message={error}
                compact
              />
            )}
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
