"use client";

import { useEffect, useState } from 'react';

export default function Quiz() {
  const [gameState, setGameState] = useState('start');

  useEffect(() => {
    if (gameState !== 'loading') return;

    const timeoutId = setTimeout(() => {
      setGameState('game');
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [gameState]);

  return (
    <section id="quiz" aria-labelledby="quiz-title">
      <h2 id="quiz-title">Quiz de Filmes e Séries</h2>
      <div id="quiz-container" role="region" aria-label="Área do Quiz">
        
        {gameState === 'start' && (
          <div id="quiz-start-screen">
            <p>Teste seus conhecimentos sobre filmes e séries!</p>
            <button id="start-quiz-btn" onClick={() => setGameState('loading')}>Começar Quiz</button>
          </div>
        )}

        {gameState === 'loading' && (
          <div id="quiz-loading-screen">
            <div className="loading-spinner-container" style={{ minHeight: '200px' }}>
              <div className="spinner"></div>
              <p>Gerando perguntas...</p>
            </div>
          </div>
        )}

        {gameState === 'game' && (
          <div id="quiz-game-screen">
            <div id="quiz-question">Qual filme foi o vencedor do Oscar de Melhor Filme em 1994? (Exemplo)</div>
            <div id="quiz-options" className="quiz-options">
              <button className="quiz-option">Forrest Gump</button>
              <button className="quiz-option">Pulp Fiction</button>
              <button className="quiz-option">Um Sonho de Liberdade</button>
            </div>
            <p id="quiz-feedback"></p>
            <button id="next-question-btn" onClick={() => setGameState('end')}>Próxima Pergunta</button>
          </div>
        )}

        {gameState === 'end' && (
          <div id="quiz-end-screen">
            <h3>Quiz Finalizado!</h3>
            <p>Sua pontuação: <span id="final-score">100</span></p>
            <p id="quiz-personality-result" style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '15px 0' }}>Cinéfilo Mestre!</p>
            <p>Recorde: <span id="high-score">100</span></p>
            <button id="restart-quiz-btn" onClick={() => setGameState('start')}>Jogar Novamente</button>
          </div>
        )}

      </div>
    </section>
  );
}
