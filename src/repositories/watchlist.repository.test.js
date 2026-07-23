import { WatchlistRepository } from './watchlist.repository.js';

describe('WatchlistRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('salva itens normalizados na watchlist local', async () => {
    const savedItem = await WatchlistRepository.add(
      {
        id: 1,
        title: 'Filme Teste',
        vote_average: 7.5
      },
      'movie'
    );

    expect(savedItem).toEqual(
      expect.objectContaining({
        id: 1,
        media_type: 'movie',
        title: 'Filme Teste',
        name: null,
        vote_average: 7.5
      })
    );
    await expect(WatchlistRepository.getAll()).resolves.toEqual([savedItem]);
  });

  it('alterna entre salvar e remover item', async () => {
    const movie = { id: 2, title: 'Favorito' };

    await expect(WatchlistRepository.toggle(movie, 'movie')).resolves.toEqual(
      expect.objectContaining({ isSaved: true })
    );
    await expect(WatchlistRepository.isSaved(2)).resolves.toBe(true);

    await expect(WatchlistRepository.toggle(movie, 'movie')).resolves.toEqual({
      isSaved: false,
      item: null
    });
    await expect(WatchlistRepository.isSaved(2)).resolves.toBe(false);
  });

  it('mantem uma unica entrada ao salvar o mesmo item novamente', async () => {
    await WatchlistRepository.add({ id: 3, title: 'Original' }, 'movie');
    await WatchlistRepository.add({ id: 3, title: 'Atualizado' }, 'movie');

    await expect(WatchlistRepository.getAll()).resolves.toEqual([
      expect.objectContaining({ id: 3, title: 'Atualizado' })
    ]);
  });
});
