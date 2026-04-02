import { QuizController } from './quiz.controller.js';

export const QuizView = {
    init() {
        this.quizStartScreen = document.getElementById('quiz-start-screen');
        this.quizGameScreen = document.getElementById('quiz-game-screen');
        this.quizEndScreen = document.getElementById('quiz-end-screen');
        this.quizLoadingScreen = document.getElementById('quiz-loading-screen');
        
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        this.restartQuizBtn = document.getElementById('restart-quiz-btn');
        this.nextQuestionBtn = document.getElementById('next-question-btn');
        
        this.quizQuestionEl = document.getElementById('quiz-question');
        this.quizOptionsEl = document.getElementById('quiz-options');
        this.quizFeedbackEl = document.getElementById('quiz-feedback');
        
        this.finalScoreEl = document.getElementById('final-score');
        this.highScoreEl = document.getElementById('high-score');
        this.personalityEl = document.getElementById('quiz-personality-result');

        this.startQuizBtn.addEventListener('click', () => QuizController.startQuiz());
        this.nextQuestionBtn.addEventListener('click', () => QuizController.nextQuestion());
        this.restartQuizBtn.addEventListener('click', () => QuizController.startQuiz());
    },

    render(state) {
        this.quizStartScreen.style.display = state.screen === 'start' ? 'block' : 'none';
        this.quizLoadingScreen.style.display = state.screen === 'loading' ? 'block' : 'none';
        this.quizGameScreen.style.display = state.screen === 'game' ? 'block' : 'none';
        this.quizEndScreen.style.display = state.screen === 'end' ? 'block' : 'none';

        if (state.screen === 'game') {
            if (state.error) {
                this.quizQuestionEl.textContent = state.error;
                this.quizOptionsEl.textContent = '';
                this.quizFeedbackEl.textContent = '';
                this.nextQuestionBtn.style.display = 'none';
                return;
            }

            const question = state.questions[state.currentQuestionIndex];
            if (!question) return;

            this.quizQuestionEl.textContent = '';
            
            const p1 = document.createElement('p');
            p1.textContent = 'Qual filme tem a seguinte sinopse?';
            
            const p2 = document.createElement('p');
            p2.className = 'quiz-synopsis';
            const em = document.createElement('em');
            em.textContent = `"${question.synopsis}"`;
            p2.appendChild(em);
            
            this.quizQuestionEl.appendChild(p1);
            this.quizQuestionEl.appendChild(p2);

            this.quizOptionsEl.textContent = '';
            question.options.forEach(option => {
                const optionEl = document.createElement('div');
                optionEl.classList.add('quiz-option');
                optionEl.textContent = option;
                
                if (state.selectedAnswer) {
                    optionEl.style.pointerEvents = 'none';
                    if (option === question.correctAnswer) {
                        optionEl.classList.add('correct');
                    } else if (option === state.selectedAnswer) {
                        optionEl.classList.add('incorrect');
                    }
                } else {
                    optionEl.addEventListener('click', () => QuizController.selectAnswer(option));
                }
                
                this.quizOptionsEl.appendChild(optionEl);
            });

            if (state.feedback) {
                this.quizFeedbackEl.textContent = state.feedback.text;
                this.quizFeedbackEl.style.color = state.feedback.isCorrect ? '#28a745' : '#dc3545';
                this.nextQuestionBtn.style.display = 'block';
            } else {
                this.quizFeedbackEl.textContent = '';
                this.nextQuestionBtn.style.display = 'none';
            }
        } else if (state.screen === 'end') {
            this.finalScoreEl.textContent = state.score;
            this.highScoreEl.textContent = state.highScore;

            if (state.score === 0) {
                this.personalityEl.textContent = 'Tente novamente! Você pode melhorar.';
            } else {
                const sortedGenres = Object.keys(state.genreScores).sort((a, b) => state.genreScores[b] - state.genreScores[a]);
                if (sortedGenres.length > 0) {
                    const topGenre = sortedGenres[0];
                    this.personalityEl.textContent = `Pelo que vimos, você é um verdadeiro especialista em filmes de ${topGenre}!`;
                } else {
                    this.personalityEl.textContent = 'Você sabe muito sobre o cinema em geral!';
                }
            }
        }
    }
};