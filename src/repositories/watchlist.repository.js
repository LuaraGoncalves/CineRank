import { StorageService } from '../core/storage.js';

function getMediaType(item) {
  return item.media_type || (item.title ? 'movie' : 'tv');
}

function normalizeWatchlistItem(item, mediaType = null) {
  return {
    id: item.id,
    media_type: mediaType || getMediaType(item),
    title: item.title || null,
    name: item.name || null,
    poster_path: item.poster_path || null,
    vote_average: item.vote_average || null,
    release_date: item.release_date || null,
    first_air_date: item.first_air_date || null
  };
}

export const WatchlistRepository = {
  async getAll() {
    return StorageService.getWatchlist();
  },

  async isSaved(itemId) {
    return StorageService.isInWatchlist(itemId);
  },

  async add(item, mediaType = null) {
    const itemToSave = normalizeWatchlistItem(item, mediaType);
    StorageService.addToWatchlist(itemToSave, itemToSave.media_type);
    return itemToSave;
  },

  async remove(itemId) {
    StorageService.removeFromWatchlist(itemId);
  },

  async toggle(item, mediaType = null) {
    const exists = await WatchlistRepository.isSaved(item.id);

    if (exists) {
      await WatchlistRepository.remove(item.id);
      return { isSaved: false, item: null };
    }

    const savedItem = await WatchlistRepository.add(item, mediaType);
    return { isSaved: true, item: savedItem };
  }
};
