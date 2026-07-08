import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logger } from '../lib/logger.js';
import { config } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const reqId = (req as any).id || 'N/A';

  if (err instanceof ApiError) {
    logger.warn({
      reqId,
      errorCode: err.errorCode,
      message: err.message,
      details: err.details,
    }, `API Warning: ${err.message}`);

    return ApiResponse.error(
      res,
      err.errorCode,
      err.message,
      err.details,
      err.statusCode
    );
  }

  // Handle unhandled express/node exceptions (e.g. database disconnect, syntax errors)
  logger.error({
    reqId,
    message: err.message || 'Internal Server Error',
    stack: err.stack,
  }, `Unhandled Exception: ${err.message}`);

  const message = config.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message || 'Internal Server Error';

  const details = config.NODE_ENV === 'production'
    ? []
    : [{ stack: err.stack }];

  return ApiResponse.error(
    res,
    'INTERNAL_SERVER_ERROR',
    message,
    details,
    500
  );
};
