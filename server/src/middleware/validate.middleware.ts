import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError';

export const validate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: 'path' in error ? (error as { path: string }).path : 'unknown',
      message: error.msg as string,
    }));

    throw ApiError.badRequest('Validation failed', formattedErrors);
  }

  next();
};
