import {
  SERVICE_STATUS,
  serviceFailure,
  serviceMissingConfig,
  serviceSuccess,
  unwrapServiceData
} from './service-result.js';

describe('service result helpers', () => {
  it('cria resultado de sucesso padronizado', () => {
    const result = serviceSuccess(['item']);

    expect(result).toEqual({
      ok: true,
      status: SERVICE_STATUS.SUCCESS,
      data: ['item'],
      error: null
    });
  });

  it('cria resultado de erro padronizado', () => {
    const result = serviceFailure(new Error('Falhou'));

    expect(result).toEqual({
      ok: false,
      status: SERVICE_STATUS.ERROR,
      data: null,
      error: 'Falhou'
    });
  });

  it('cria erro de configuracao ausente', () => {
    const result = serviceMissingConfig('TMDB_API_KEY');

    expect(result.ok).toBe(false);
    expect(result.status).toBe(SERVICE_STATUS.MISSING_CONFIG);
    expect(result.error).toContain('TMDB_API_KEY');
  });

  it('desembrulha sucesso e aplica fallback em erro', () => {
    expect(unwrapServiceData(serviceSuccess([1, 2]), [])).toEqual([1, 2]);
    expect(unwrapServiceData(serviceFailure('Erro'), [])).toEqual([]);
  });
});
