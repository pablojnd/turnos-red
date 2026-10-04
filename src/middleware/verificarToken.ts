import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/errorResponse.js';
import { logger } from '../config/logger.js';

export interface UsuarioEnToken {
  id: number;
  rol: string;
}

export function verificarToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    sendError(res, 401, 'Token no enviado', 'AUTH_TOKEN_MISSING');
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    sendError(res, 401, 'Token no enviado', 'AUTH_TOKEN_MISSING');
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? '') as UsuarioEnToken;
    (req as Request & { user?: UsuarioEnToken }).user = payload;
    next();
  } catch {
    logger.warn({ ruta: req.originalUrl }, 'Intento de acceso con token inválido o expirado');
    sendError(res, 401, 'Token inválido o expirado', 'AUTH_TOKEN_INVALID');
  }
}
