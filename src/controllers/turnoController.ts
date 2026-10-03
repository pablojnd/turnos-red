import type { Request, Response } from 'express';
import type { TurnoCrudo } from '../models/turno.js';
import {
  actualizarTurno,
  crearTurno,
  eliminarTurno,
  obtenerTurnoPorId,
  obtenerTurnos,
} from '../services/turnoService.js';

function leerId(valor: unknown): number | null {
  const id = Number(Array.isArray(valor) ? valor[0] : valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function listar(_req: Request, res: Response): void {
  res.status(200).json(obtenerTurnos());
}

export function obtener(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const turno = obtenerTurnoPorId(id);
  if (!turno) {
    res.status(404).json({ error: 'Turno no encontrado' });
    return;
  }

  res.status(200).json(turno);
}

export function crear(req: Request, res: Response): void {
  const turno = crearTurno(req.body as TurnoCrudo);
  if (!turno) {
    res.status(400).json({ error: 'Datos inválidos o ID repetido' });
    return;
  }

  res.status(201).json(turno);
}

export function actualizar(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  if (!obtenerTurnoPorId(id)) {
    res.status(404).json({ error: 'Turno no encontrado' });
    return;
  }

  const turno = actualizarTurno(id, req.body as TurnoCrudo);
  if (!turno) {
    res.status(400).json({ error: 'Datos inválidos' });
    return;
  }

  res.status(200).json(turno);
}

export function eliminar(req: Request, res: Response): void {
  const id = leerId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const turno = eliminarTurno(id);
  if (!turno) {
    res.status(404).json({ error: 'Turno no encontrado' });
    return;
  }

  res.status(200).json(turno);
}
