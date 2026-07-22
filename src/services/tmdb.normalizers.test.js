import {
  normalizeGenres,
  normalizeMediaItem,
  normalizeMediaList,
  normalizeMovieDetails
} from './tmdb.normalizers.js';

describe('TMDB normalizers', () => {
  it('normaliza filmes e series para um formato previsivel', () => {
    const movie = normalizeMediaItem(
      {
        id: 10,
        title: 'Filme Teste',
        vote_average: '8.5',
        poster_path: '',
        genre_ids: null
      },
      'movie'
    );

    expect(movie).toEqual(
      expect.objectContaining({
        id: 10,
        media_type: 'movie',
        title: 'Filme Teste',
        name: null,
        vote_average: 8.5,
        poster_path: null,
        genre_ids: []
      })
    );
  });

  it('remove itens sem tipo valido da lista', () => {
    const list = normalizeMediaList([
      { id: 1, title: 'Filme', media_type: 'movie' },
      { id: 2, media_type: 'person' },
      { title: 'Sem ID', media_type: 'movie' }
    ]);

    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(expect.objectContaining({ id: 1 }));
  });

  it('normaliza detalhes mantendo campos usados pela tela', () => {
    const details = normalizeMovieDetails(
      {
        id: 20,
        name: 'Serie Teste',
        runtime: '45',
        genres: [{ id: 18, name: 'Drama' }, { id: null, name: 'Inválido' }],
        credits: null,
        created_by: null,
        videos: null
      },
      'tv'
    );

    expect(details).toEqual(
      expect.objectContaining({
        id: 20,
        media_type: 'tv',
        runtime: 45,
        genres: [{ id: 18, name: 'Drama' }],
        credits: { crew: [], cast: [] },
        created_by: [],
        videos: { results: [] }
      })
    );
  });

  it('normaliza generos removendo entradas incompletas', () => {
    expect(
      normalizeGenres([
        { id: 28, name: 'Ação' },
        { id: 0, name: 'Sem ID' },
        { id: 35, name: '' }
      ])
    ).toEqual([{ id: 28, name: 'Ação' }]);
  });
});
