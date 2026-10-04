import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const readFileMock = jest.fn();
jest.unstable_mockModule('node:fs/promises', () => ({
  readFile: readFileMock,
}));

const {
  cargarTurnos,
  obtenerTurnos,
  obtenerTurnoPorId,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
} = await import('../../src/services/turnoService.js');

const registros = [
  {
    id: '1',
    paciente: ' Ana Torres ',
    documento: 30111111,
    especialidad: 'Pediatría',
    fecha: '14/08/2026',
    hora: '10.00',
    confirmado: 'si',
  },
  { id: 'abc', paciente: 'Inválido' },
];

describe('turnoService (unitario, capa de servicios)', () => {
  beforeEach(async () => {
    readFileMock.mockResolvedValue(JSON.stringify(registros));
    await cargarTurnos('./fixture.json');
  });

  it('descarta registros inválidos y acepta el válido', () => {
    expect(obtenerTurnos()).toHaveLength(1);
    expect(obtenerTurnoPorId(1)?.paciente).toBe('Ana Torres');
  });

  it('crea un turno con datos válidos', () => {
    const turno = crearTurno({
      id: '2',
      paciente: 'Luis Pérez',
      documento: '30222222',
      especialidad: 'Odontología',
      fecha: '20/08/2026',
      hora: '09.30',
      confirmado: 'no',
    });
    expect(turno).not.toBeNull();
    expect(obtenerTurnoPorId(2)?.fecha).toBe('2026-08-20');
  });

  it('rechaza crear un turno sin cumplir precondiciones (id repetido)', () => {
    const duplicado = crearTurno({
      id: '1',
      paciente: 'Duplicado',
      documento: '30333333',
      especialidad: 'Pediatría',
      fecha: '21/08/2026',
      hora: '09.00',
      confirmado: true,
    });
    expect(duplicado).toBeNull();
  });

  it('rechaza actualizar un turno inexistente o inválido', () => {
    expect(actualizarTurno(99, registros[0])).toBeNull();
    expect(
      actualizarTurno(1, { ...registros[0], id: '1', confirmado: 'quizas' }),
    ).toBeNull();
  });

  it('eliminar devuelve null si no existe y el turno eliminado si existe', () => {
    expect(eliminarTurno(99)).toBeNull();
    expect(eliminarTurno(1)?.paciente).toBe('Ana Torres');
  });
});
