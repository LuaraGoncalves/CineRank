import { buildQuestions } from './useQuizGame.js';

describe('buildQuestions', () => {
  it('monta perguntas com uma resposta correta e quatro opcoes', () => {
    const movies = Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      title: `Filme ${index + 1}`,
      overview: `Sinopse ${index + 1}`,
      genre_ids: [28]
    }));

    const questions = buildQuestions(movies);

    expect(questions).toHaveLength(5);
    questions.forEach((question) => {
      expect(question.options).toHaveLength(4);
      expect(question.options).toContain(question.correctAnswer);
      expect(question.synopsis).toBeTruthy();
    });
  });

  it('nao altera a lista original de filmes', () => {
    const movies = [
      { id: 1, title: 'Filme 1', overview: 'Sinopse 1' },
      { id: 2, title: 'Filme 2', overview: 'Sinopse 2' },
      { id: 3, title: 'Filme 3', overview: 'Sinopse 3' },
      { id: 4, title: 'Filme 4', overview: 'Sinopse 4' }
    ];
    const originalOrder = movies.map((movie) => movie.id);

    buildQuestions(movies);

    expect(movies.map((movie) => movie.id)).toEqual(originalOrder);
  });
});
