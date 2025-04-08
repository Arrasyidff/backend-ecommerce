// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors/api-error';
import logger from '../utils/logger';

export const errorMiddleware = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Cek apakah res adalah response Express yang valid dan memiliki metode status
  if (!res || typeof res.status !== 'function') {
    logger.error('Invalid response object in error middleware');
    return next(error);
  }

  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack: string | undefined;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  } else {
    message = error.message;
  }

  // Only include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    stack = error.stack;
  }

  logger.error(`[${statusCode}] ${message}`, { 
    path: req.path, 
    method: req.method,
    stack
  });

  try {
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    });
  } catch (err) {
    logger.error('Error sending response in error middleware', err);
    next(error); // Pass along the original error if we can't respond
  }
};