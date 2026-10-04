import type { Request, Response } from 'express';
import type { MedicoCrudo } from '../models/medico.js';
import {
  actualizarMedico,
  crearMedico,
  eliminarMedico,
  obtenerMedicoPorId,
  obtenerMedicos,
} from '../services/medicoService.js';
import { sendError } from '../utils/errorResponse.js';

function leerId(valor: unknown): number | null {
  const id = Number(Array.isArray(valor) ? valor[0] : valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function listar(req: Request, res: Response): void {
  const medicos = obtenerMedicos({
    especialidad:
      typeof req.query.especialidad === 'string'
        ? req.query.especialidad
        : undefined,
    disponible:
      typeof req.query.disponible === 'string'
        ? req.query.disponible
        : undefined,
  });
  res.status(200).json(medicos);
}

export function obtener(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    sendError(res, 400, 'ID inválido', 'INVALID_ID');
    return;
  }

  const medico = obtenerMedicoPorId(id);
  if (!medico) {
    sendError(res, 404, 'Médico no encontrado', 'NOT_FOUND');
    return;
  }

  res.status(200).json(medico);
}

export function crear(req: Request, res: Response): void {
  const medico = crearMedico(req.body as MedicoCrudo);
  if (!medico) {
    sendError(res, 400, 'Datos inválidos o ID repetido', 'BAD_REQUEST');
    return;
  }

  res.status(201).json(medico);
}

export function actualizar(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    sendError(res, 400, 'ID inválido', 'INVALID_ID');
    return;
  }

  if (!obtenerMedicoPorId(id)) {
    sendError(res, 404, 'Médico no encontrado', 'NOT_FOUND');
    return;
  }

  const medico = actualizarMedico(id, req.body as MedicoCrudo);
  if (!medico) {
    sendError(res, 400, 'Datos inválidos', 'BAD_REQUEST');
    return;
  }

  res.status(200).json(medico);
}

export function eliminar(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    sendError(res, 400, 'ID inválido', 'INVALID_ID');
    return;
  }

  const medico = eliminarMedico(id);
  if (!medico) {
    sendError(res, 404, 'Médico no encontrado', 'NOT_FOUND');
    return;
  }

  res.status(204).send();
}
