import type { Turno, TurnoCrudo } from '../models/turno.js';

function normalizarFecha(fecha: string): string {
  const valor = fecha.trim();
  const partes = valor.split('/');

  if (partes.length === 3) {
    const [dia, mes, anio] = partes;
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  return valor;
}

function normalizarHora(hora: string): string {
  return hora.trim().replace('.', ':');
}

function normalizarConfirmado(valor: TurnoCrudo['confirmado']): boolean | null {
  if (typeof valor === 'boolean') return valor;
  if (typeof valor === 'number')
    return valor === 1 ? true : valor === 0 ? false : null;
  if (typeof valor !== 'string') return null;

  const texto = valor.trim().toLowerCase();
  if (['si', 'sí', 'true', '1'].includes(texto)) return true;
  if (['no', 'false', '0'].includes(texto)) return false;

  return null;
}

export function normalizarTurno(crudo: TurnoCrudo): Turno | null {
  const id = Number(crudo.id);
  const paciente = crudo.paciente?.trim() ?? '';
  const documento =
    crudo.documento !== undefined ? String(crudo.documento).trim() : '';
  const especialidad = crudo.especialidad?.trim() ?? '';
  const fecha = crudo.fecha ? normalizarFecha(crudo.fecha) : '';
  const hora = crudo.hora ? normalizarHora(crudo.hora) : '';
  const confirmado = normalizarConfirmado(crudo.confirmado);
  const observaciones = crudo.observaciones?.trim();

  if (!Number.isInteger(id) || id <= 0) return null;
  if (!paciente || !documento || !especialidad || !fecha || !hora) return null;
  if (confirmado === null) return null;

  return {
    id,
    paciente,
    documento,
    especialidad,
    fecha,
    hora,
    confirmado,
    ...(observaciones ? { observaciones } : {}),
  };
}
