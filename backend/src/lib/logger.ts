import pino from 'pino';
import { config } from '../config/env.js';

const pinoOptions: pino.LoggerOptions = {
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
};

if (config.NODE_ENV !== 'production') {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(pinoOptions);
