import pino from 'pino';

const esProduccion = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (esProduccion ? 'error' : 'info'),
});
