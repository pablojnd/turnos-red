import { readFile } from 'node:fs/promises';
import type { Turno, TurnoCrudo } from '../models/turno.js';
import { normalizarTurno } from '../utils/normalizarTurno.js';
import { eventBus } from '../events/eventBus.js';
import { logger } from '../config/logger.js';

let turnos: Turno[] = [];

export async function cargarTurnos(rutaArchivo: string): Promise<void> {
  try {
    const contenido = await readFile(rutaArchivo, 'utf8');
    const datos = JSON.parse(contenido) as TurnoCrudo[];

    let aceptados = 0;
    let rechazados = 0;
    const validos: Turno[] = [];

    for (const crudo of datos) {
      const turno = normalizarTurno(crudo);
      if (turno) {
        validos.push(turno);
        aceptados++;
      } else {
        rechazados++;
      }
    }

    turnos = validos;
    console.log(`Registros aceptados: ${aceptados}`);
    console.log(`Registros rechazados: ${rechazados}`);
  } catch (error) {
    console.error('Error al leer turnos.json:', error);
    throw error;
  }
}

const sinAcentos = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function obtenerTurnos(filtros?: {
  especialidad?: string;
  fecha?: string;
  medicoId?: string;
}): Turno[] {
  let resultado = turnos;

  if (filtros?.especialidad) {
    const valor = sinAcentos(filtros.especialidad);
    resultado = resultado.filter((turno) =>
      sinAcentos(turno.especialidad).includes(valor),
    );
  }

  if (filtros?.fecha) {
    let buscado = filtros.fecha.trim();
    if (buscado.includes('/')) {
      const [dia, mes, anio] = buscado.split('/');
      buscado = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    resultado = resultado.filter((turno) => turno.fecha === buscado);
  }

  if (filtros?.medicoId) {
    const buscado = Number(filtros.medicoId);
    resultado = resultado.filter((turno) => turno.medicoId === buscado);
  }

  return resultado;
}

export function obtenerTurnoPorId(id: number): Turno | undefined {
  return turnos.find((turno) => turno.id === id);
}

export function crearTurno(datos: TurnoCrudo): Turno | null {
  const turno = normalizarTurno(datos);
  if (!turno || obtenerTurnoPorId(turno.id)) return null;

  turnos.push(turno);
  eventBus.emit('turno:creado', turno);
  logger.info({ id: turno.id }, 'Turno creado');
  return turno;
}

export function actualizarTurno(id: number, datos: TurnoCrudo): Turno | null {
  const indice = turnos.findIndex((turno) => turno.id === id);
  if (indice === -1) return null;

  const turno = normalizarTurno({ ...datos, id });
  if (!turno) return null;

  turnos[indice] = turno;
  eventBus.emit('turno:actualizado', turno);
  logger.info({ id: turno.id }, 'Turno actualizado');
  return turno;
}

export function eliminarTurno(id: number): Turno | null {
  const indice = turnos.findIndex((turno) => turno.id === id);
  if (indice === -1) return null;

  const [eliminado] = turnos.splice(indice, 1);
  eventBus.emit('turno:eliminado', eliminado);
  logger.info({ id: eliminado.id }, 'Turno eliminado');
  return eliminado;
}
