function isInfoLogEnabled() {
  const env = typeof process !== 'undefined' ? process.env : {};

  return (
    env?.NEXT_PUBLIC_DEBUG_LOGS === 'true' || env?.NEWS_DEBUG_LOGS === 'true'
  );
}

function normalizeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    };
  }

  return {
    message: String(error)
  };
}

function writeLog(method, level, event, details = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details
  };

  console[method](JSON.stringify(payload));
}

export const logger = {
  info(event, details = {}) {
    if (!isInfoLogEnabled()) return;
    writeLog('info', 'INFO', event, details);
  },

  warn(event, details = {}) {
    writeLog('warn', 'WARN', event, details);
  },

  error(event, error, details = {}) {
    writeLog('error', 'ERROR', event, {
      error: normalizeError(error),
      ...details
    });
  }
};
