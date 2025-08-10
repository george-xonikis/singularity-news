import { Request, Response, NextFunction } from 'express';
import { ErrorResponseDto } from '../../features/articles/dtos';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Default error response
  let statusCode = error.statusCode || 500;
  let message = 'Internal server error';

  // Handle known error types
  if (error.isOperational) {
    statusCode = error.statusCode || 400;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.message?.includes('duplicate key')) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.message?.includes('foreign key constraint')) {
    statusCode = 400;
    message = 'Invalid reference';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  const errorDetails: { message?: string; errors?: string[] } = {};
  if (statusCode === 500 && process.env.NODE_ENV !== 'production') {
    errorDetails.message = error.message;
  }

  res.status(statusCode).json(new ErrorResponseDto(message, errorDetails));
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(new ErrorResponseDto(`Route ${req.method} ${req.path} not found`));
}

/**
 * Create an operational error (known error that should be shown to user)
 */
export function createError(message: string, statusCode = 400): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}