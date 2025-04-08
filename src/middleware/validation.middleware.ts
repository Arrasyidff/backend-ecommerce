import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'joi';
import { ApiError } from '../utils/errors/api-error';

interface JoiError extends Error {
  isJoi: boolean;
  details: any[];
}

export const validationMiddleware = (schema: AnySchema) => {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedBody = await schema.validateAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      // Type guard to check if error is a Joi error
      if (error instanceof Error && 'isJoi' in error && (error as JoiError).isJoi) {
        const joiError = error as JoiError;
        next(new ApiError(400, `Validation error: ${joiError.message}`));
      } else {
        // For any other type of error
        next(new ApiError(500, 'Internal server error during validation'));
      }
    }
  };
};