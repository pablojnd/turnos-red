import type { Request, Response } from 'express';
import type { TurnoCrudo } from '../models/turno.js';
import {
  actualizarTurno,
  crearTurno,
  eliminarTurno,
  obtenerTurnoPorId,
  obtenerTurnos,
} from '../services/turnoService.js';
import { sendError } from '../utils/errorResponse.js';

function leerId(valor: unknown): number | null {
  const id = Number(Array.isArray(valor) ? valor[0] : valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function listar(req: Request, res: Response): void {
  const turnos = obtenerTurnos({
    especialidad:
      typeof req.query.especialidad === 'string'
        ? req.query.especialidad
        : undefined,
    fecha: typeof req.query.fecha === 'string' ? req.query.fecha : undefined,
    medicoId:
      typeof req.query.medicoId === 'string' ? req.query.medicoId : undefined,
  });
  res.status(200).json(turnos);
}

export function obtener(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    sendError(res, 400, 'ID inválido', 'INVALID_ID');
    return;
  }

  const turno = obtenerTurnoPorId(id);
  if (!turno) {
    sendError(res, 404, 'Turno no encontrado', 'RESOURCE_NOT_FOUND');
    return;
  }

  res.status(200).json(turno);
}

export function crear(req: Request, res: Response): void {
  const turno = crearTurno(req.body as TurnoCrudo);
  if (!turno) {
    sendError(res, 409, 'Datos inválidos o ID duplicado', 'RESOURCE_CONFLICT');
    return;
  }

  res.status(201).json(turno);
}

export function actualizar(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    sendError(res, 400, 'ID inválido', 'INVALID_ID');
    return;
  }

  if (!obtenerTurnoPorId(id)) {
    sendError(res, 404, 'Turno no encontrado', 'RESOURCE_NOT_FOUND');
    return;
  }

  const turno = actualizarTurno(id, req.body as TurnoCrudo);
  if (!turno) {
    sendError(res, 400, 'Datos inválidos', 'BAD_REQUEST');
    return;
  }

  res.status(200).json(turno);
}

export function eliminar(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    sendError(res, 400, 'ID inválido', 'INVALID_ID');
    return;
  }

  const turno = eliminarTurno(id);
  if (!turno) {
    sendError(res, 404, 'Turno no encontrado', 'RESOURCE_NOT_FOUND');
    return;
  }

  res.status(204).send();
}
