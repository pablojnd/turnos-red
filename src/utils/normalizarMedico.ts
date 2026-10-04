import type { Medico, MedicoCrudo } from '../models/medico.js';

function normalizarDisponible(
  valor: MedicoCrudo['disponible'],
): boolean | null {
  if (typeof valor === 'boolean') return valor;
  if (typeof valor === 'number')
    return valor === 1 ? true : valor === 0 ? false : null;
  if (typeof valor !== 'string') return null;

  const texto = valor.trim().toLowerCase();
  if (['si', 'sí', 'true', '1'].includes(texto)) return true;
  if (['no', 'false', '0'].includes(texto)) return false;

  return null;
}

export function normalizarMedico(crudo: MedicoCrudo): Medico | null {
  const id = Number(crudo.id);
  const nombre = crudo.nombre?.trim() ?? '';
  const especialidad = crudo.especialidad?.trim() ?? '';
  const disponible = normalizarDisponible(crudo.disponible);

  if (!Number.isInteger(id) || id <= 0) return null;
  if (!nombre || !especialidad) return null;
  if (disponible === null) return null;

  return { id, nombre, especialidad, disponible };
}
