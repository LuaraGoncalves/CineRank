export const SERVICE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  MISSING_CONFIG: 'missing_config'
};

function normalizeError(error, fallbackMessage) {
  if (!error) return fallbackMessage;
  if (error instanceof Error) return error.message;
  return String(error);
}

export function serviceSuccess(data) {
  return {
    ok: true,
    status: SERVICE_STATUS.SUCCESS,
    data,
    error: null
  };
}

export function serviceFailure(error, status = SERVICE_STATUS.ERROR) {
  return {
    ok: false,
    status,
    data: null,
    error: normalizeError(error, 'Falha ao buscar dados')
  };
}

export function serviceMissingConfig(configName) {
  return serviceFailure(
    `Variável de ambiente ${configName} não configurada`,
    SERVICE_STATUS.MISSING_CONFIG
  );
}

export function unwrapServiceData(result, fallback) {
  if (!result || typeof result !== 'object' || !('status' in result)) {
    return result ?? fallback;
  }

  return result.ok ? result.data : fallback;
}
