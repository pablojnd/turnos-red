import type { Request, Response } from 'express';
import { registrarUsuario, loginUsuario } from '../services/authService.js';
import { sendError } from '../utils/errorResponse.js';
import { logger } from '../config/logger.js';

export async function registro(req: Request, res: Response): Promise<void> {
  const creado = await registrarUsuario(req.body);
  if (!creado) {
    sendError(res, 409, 'El usuario ya existe', 'RESOURCE_CONFLICT');
    return;
  }
  res.status(201).json(creado);
}

export async function login(req: Request, res: Response): Promise<void> {
  const token = await loginUsuario(req.body);
  if (!token) {
    logger.warn({ usuario: req.body?.nombre }, 'Intento fallido de login');
    sendError(res, 401, 'Credenciales inválidas', 'AUTH_TOKEN_INVALID');
    return;
  }
  res.status(200).json({ token });
}
