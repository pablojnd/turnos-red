import { readFile } from 'node:fs/promises';
import type { Medico, MedicoCrudo } from '../models/medico.js';
import { normalizarMedico } from '../utils/normalizarMedico.js';
import { logger } from '../config/logger.js';

let medicos: Medico[] = [];

export async function cargarMedicos(rutaArchivo: string): Promise<void> {
  try {
    const contenido = await readFile(rutaArchivo, 'utf8');
    const datos = JSON.parse(contenido) as MedicoCrudo[];
    medicos = datos
      .map((crudo) => normalizarMedico(crudo))
      .filter((medico): medico is Medico => medico !== null);
  } catch (error) {
    console.error('Error al leer medicos.json:', error);
    throw error;
  }
}

const sinAcentos = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function obtenerMedicos(filtros?: {
  especialidad?: string;
  disponible?: string;
}): Medico[] {
  let resultado = medicos;

  if (filtros?.especialidad) {
    const valor = sinAcentos(filtros.especialidad);
    resultado = resultado.filter((medico) =>
      sinAcentos(medico.especialidad).includes(valor),
    );
  }

  if (filtros?.disponible !== undefined && filtros.disponible !== '') {
    const buscado = filtros.disponible === 'true';
    resultado = resultado.filter((medico) => medico.disponible === buscado);
  }

  return resultado;
}

export function obtenerMedicoPorId(id: number): Medico | undefined {
  return medicos.find((medico) => medico.id === id);
}

export function crearMedico(datos: MedicoCrudo): Medico | null {
  const medico = normalizarMedico(datos);
  if (!medico || obtenerMedicoPorId(medico.id)) return null;

  medicos.push(medico);
  logger.info({ id: medico.id }, 'Médico creado');
  return medico;
}

export function actualizarMedico(
  id: number,
  datos: MedicoCrudo,
): Medico | null {
  const indice = medicos.findIndex((medico) => medico.id === id);
  if (indice === -1) return null;

  const medico = normalizarMedico({ ...datos, id });
  if (!medico) return null;

  medicos[indice] = medico;
  logger.info({ id: medico.id }, 'Médico actualizado');
  return medico;
}

export function eliminarMedico(id: number): Medico | null {
  const indice = medicos.findIndex((medico) => medico.id === id);
  if (indice === -1) return null;

  const [eliminado] = medicos.splice(indice, 1);
  logger.info({ id: eliminado.id }, 'Médico eliminado');
  return eliminado;
}
