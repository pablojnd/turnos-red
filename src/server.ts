import 'dotenv/config';
import http from 'node:http';
import path from 'node:path';
import { Server } from 'socket.io';
import { app } from './app.js';
import { eventBus } from './events/eventBus.js';
import { cargarTurnos } from './services/turnoService.js';
import { cargarMedicos } from './services/medicoService.js';
import { cargarUsuarios } from './services/authService.js';
import type { Turno } from './models/turno.js';

const servidor = http.createServer(app);
const io = new Server(servidor);

const puerto = Number(process.env.PORT ?? 3000);
const rutaDatos = path.resolve(process.env.DATA_FILE ?? './data/turnos.json');

eventBus.on('turno:creado', (turno: Turno) => {
  io.emit('turno:nuevo', turno);
});

eventBus.on('turno:actualizado', (turno: Turno) => {
  io.emit('turno:actualizado', turno);
});

eventBus.on('turno:eliminado', (turno: Turno) => {
  io.emit('turno:eliminado', turno);
});

async function iniciar(): Promise<void> {
  try {
    await cargarTurnos(rutaDatos);
    await cargarMedicos('./data/medicos.json');
    await cargarUsuarios('./data/usuarios.json');

    servidor.listen(puerto, () => {
      console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
      console.log(
        `Cliente Socket.IO: http://localhost:${puerto}/socket-test.html`,
      );
    });
  } catch {
    process.exit(1);
  }
}

void iniciar();
