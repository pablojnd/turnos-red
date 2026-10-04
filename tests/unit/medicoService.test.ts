import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const readFileMock = jest.fn();
jest.unstable_mockModule('node:fs/promises', () => ({
  readFile: readFileMock,
}));

const {
  cargarMedicos,
  obtenerMedicos,
  obtenerMedicoPorId,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
} = await import('../../src/services/medicoService.js');

describe('medicoService (unitario, capa de servicios)', () => {
  beforeEach(async () => {
    readFileMock.mockResolvedValue(
      JSON.stringify([
        { id: '1', nombre: ' Dra. Ana ', especialidad: 'Pediatría', disponible: 'si' },
        { id: '0', nombre: '', especialidad: 'Pediatría' },
      ]),
    );
    await cargarMedicos('./fixture.json');
  });

  it('filtra por especialidad sin distinguir acentos', () => {
    const resultado = obtenerMedicos({ especialidad: 'pediatria' });
    expect(resultado).toHaveLength(1);
  });

  it('filtra por disponibilidad', () => {
    expect(obtenerMedicos({ disponible: 'true' })).toHaveLength(1);
    expect(obtenerMedicos({ disponible: 'false' })).toHaveLength(0);
  });

  it('rechaza crear con id duplicado y acepta uno nuevo', () => {
    expect(
      crearMedico({ id: '1', nombre: 'Otro', especialidad: 'Nutrición', disponible: true }),
    ).toBeNull();
    const nuevo = crearMedico({
      id: '2',
      nombre: 'Dr. Luna',
      especialidad: 'Nutrición',
      disponible: true,
    });
    expect(nuevo).not.toBeNull();
    expect(obtenerMedicoPorId(2)?.nombre).toBe('Dr. Luna');
  });

  it('actualizar y eliminar resuelven correctamente los casos borde', () => {
    expect(actualizarMedico(99, { nombre: 'X', especialidad: 'Pediatría', disponible: true })).toBeNull();
    expect(eliminarMedico(99)).toBeNull();
    const eliminado = eliminarMedico(1);
    expect(eliminado?.nombre).toBe('Dra. Ana');
  });
});
