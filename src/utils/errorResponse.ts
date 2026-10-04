import type { Response } from 'express';

export function sendError(
  res: Response,
  status: number,
  message: string,
  code: string,
  details: unknown[] = [],
): void {
  res.status(status).json({ status, message, code, details });
}
