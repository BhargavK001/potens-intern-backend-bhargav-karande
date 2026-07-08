import { pinoHttp } from 'pino-http';
import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

const pinoHttpMiddleware = pinoHttp({
  logger,
  genReqId: (req: IncomingMessage) => {
    const existingId = req.headers['x-request-id'];
    if (existingId) {
      return Array.isArray(existingId) ? existingId[0] ?? crypto.randomUUID() : existingId;
    }
    return crypto.randomUUID();
  },
  customSuccessMessage: (req: IncomingMessage, res: ServerResponse, responseTime: number) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;
  },
  customErrorMessage: (req: IncomingMessage, res: ServerResponse, err: Error) => {
    return `${req.method} ${req.url} ${res.statusCode} - error: ${err.message}`;
  },
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  pinoHttpMiddleware(req, res, () => {
    if (req.id) {
      res.setHeader('x-request-id', String(req.id));
    }
    next();
  });
};
