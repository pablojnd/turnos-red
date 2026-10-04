import { describe, expect, it, beforeAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../src/app.js';
import { cargarTurnos } from '../../src/services/turnoService.js';
import { cargarMedicos } from '../../src/services/medicoService.js';
import { cargarUsuarios } from '../../src/services/authService.js';

const token = jwt.sign({ id: 1, rol: 'admin' }, process.env.JWT_SECRET ?? '');

describe('API (integración con Supertest)', () => {
  beforeAll(async () => {
    await cargarTurnos('./data/turnos.json');
    await cargarMedicos('./data/medicos.json');
    await cargarUsuarios('./data/usuarios.json');
  });

  it('POST /turnos responde 201 ante datos válidos', async () => {
    const res = await request(app)
      .post('/turnos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: '500',
        paciente: 'Integra ción',
        documento: '30500000',
        especialidad: 'Nutrición',
        fecha: '15/02/2027',
        hora: '08.00',
        confirmado: 'si',
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 500);
  });

  it('POST /turnos responde 400 ante datos malformados', async () => {
    const res = await request(app)
      .post('/turnos')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: '501', paciente: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it('POST /turnos responde 401 sin token', async () => {
    const res = await request(app).post('/turnos').send({ id: '502' });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('AUTH_TOKEN_MISSING');
  });

  it('GET /turnos es público y agrega array', async () => {
    const res = await request(app).get('/turnos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /medicos/:id sin token responde 401', async () => {
    const res = await request(app).delete('/medicos/1');
    expect(res.status).toBe(401);
  });
});
