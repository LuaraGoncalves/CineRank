import { StorageService } from './storage.js';
import { STORAGE_KEYS } from './constants.js';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adiciona, consulta e remove itens da watchlist', () => {
    const movie = {
      id: 1,
      title: 'Filme Teste',
      poster_path: '/poster.jpg'
    };

    StorageService.addToWatchlist(movie, 'movie');

    expect(StorageService.isInWatchlist(1)).toBe(true);
    expect(StorageService.getWatchlist()).toEqual([
      expect.objectContaining({ id: 1, media_type: 'movie' })
    ]);

    StorageService.removeFromWatchlist(1);

    expect(StorageService.isInWatchlist(1)).toBe(false);
    expect(StorageService.getWatchlist()).toEqual([]);
  });

  it('substitui o item quando o mesmo filme e salvo novamente', () => {
    StorageService.addToWatchlist({ id: 7, title: 'Original' }, 'movie');
    StorageService.addToWatchlist({ id: 7, title: 'Atualizado' }, 'movie');

    expect(StorageService.getWatchlist()).toEqual([
      expect.objectContaining({ id: 7, title: 'Atualizado' })
    ]);
  });

  it('salva preferencias simples nas chaves padronizadas', () => {
    StorageService.setTheme('light');
    StorageService.setHighScore(4);
    StorageService.setLastSeenNewsDate('2026-07-08T00:00:00.000Z');

    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('light');
    expect(StorageService.getHighScore()).toBe(4);
    expect(StorageService.getLastSeenNewsDate()).toBe(
      '2026-07-08T00:00:00.000Z'
    );
  });
});
