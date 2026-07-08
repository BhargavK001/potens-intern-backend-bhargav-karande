import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const providedApiKey = req.headers['x-api-key'];

  if (!providedApiKey || typeof providedApiKey !== 'string') {
    return next(new ApiError(401, 'UNAUTHORIZED', 'Missing X-API-Key header'));
  }

  const expectedApiKey = config.API_KEY;

  // Standardize buffer lengths by hashing keys using SHA-256, mitigating timing attacks and differing length crashes
  const clientKeyHash = crypto.createHash('sha256').update(providedApiKey).digest();
  const serverKeyHash = crypto.createHash('sha256').update(expectedApiKey).digest();

  if (!crypto.timingSafeEqual(clientKeyHash, serverKeyHash)) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'Invalid API Key'));
  }

  next();
};
