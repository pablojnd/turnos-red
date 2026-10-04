import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { sendError } from '../utils/errorResponse.js';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      sendError(
        res,
        400,
        'Error de validación en los datos ingresados',
        'VALIDATION_ERROR',
        details,
      );
      return;
    }

    req.body = result.data;
    next();
  };
}
