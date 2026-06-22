import { isProduction } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const payload = {
    status: 'error',
    message: statusCode === 500 && isProduction ? 'Internal server error' : error.message,
    errors: error.details || undefined
  };

  if (!isProduction) {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
}
