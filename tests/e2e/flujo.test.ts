import { describe, expect, it, beforeAll } from '@jest/globals';
import request from 'supertest';
import fs from 'node:fs';
import { app } from '../../src/app.js';
import { cargarTurnos } from '../../src/services/turnoService.js';
import { cargarMedicos } from '../../src/services/medicoService.js';
import { cargarUsuarios } from '../../src/services/authService.js';

describe('Flujo E2E: registro → login → crear → leer → actualizar → eliminar', () => {
  let token = '';
  let turnoId = 0;

  beforeAll(async () => {
    fs.copyFileSync('./data/turnos.json', '/tmp/e2e-turnos.json');
    fs.copyFileSync('./data/medicos.json', '/tmp/e2e-medicos.json');
    fs.writeFileSync('/tmp/e2e-usuarios.json', '[]');
    await cargarTurnos('/tmp/e2e-turnos.json');
    await cargarMedicos('/tmp/e2e-medicos.json');
    await cargarUsuarios('/tmp/e2e-usuarios.json');
  });

  it('1. Registro', async () => {
    const res = await request(app)
      .post('/auth/registro')
      .send({ nombre: 'e2e_user', password: 'clave123', rol: 'user' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('2. Login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ nombre: 'e2e_user', password: 'clave123' });
    expect(res.status).toBe(200);
    token = res.body.token;
    expect(token).toBeTruthy();
  });

  it('3. Crear turno con token', async () => {
    const res = await request(app)
      .post('/turnos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: '700',
        paciente: 'E2E Paciente',
        documento: '30700100',
        especialidad: 'Clínica médica',
        fecha: '01/03/2027',
        hora: '10.00',
        confirmado: 'si',
      });
    expect(res.status).toBe(201);
    turnoId = res.body.id;
  });

  it('4. Leer turno', async () => {
    const res = await request(app).get(`/turnos/${turnoId}`);
    expect(res.status).toBe(200);
    expect(res.body.paciente).toBe('E2E Paciente');
  });

  it('5. Actualizar turno', async () => {
    const res = await request(app)
      .put(`/turnos/${turnoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        paciente: 'E2E Paciente',
        documento: '30700100',
        especialidad: 'Clínica médica',
        fecha: '02/03/2027',
        hora: '11:00',
        confirmado: true,
      });
    expect(res.status).toBe(200);
    expect(res.body.fecha).toBe('2027-03-02');
  });

  it('6. Eliminar turno', async () => {
    const res = await request(app)
      .delete(`/turnos/${turnoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);

    const resGet = await request(app).get(`/turnos/${turnoId}`);
    expect(resGet.status).toBe(404);
  });
});
