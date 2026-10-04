import 'dotenv/config';
import http from 'node:http';
import path from 'node:path';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { Server } from 'socket.io';
import { eventBus } from './events/eventBus.js';
import { turnoRouter } from './routes/turnoRoutes.js';
import { medicoRouter } from './routes/medicoRoutes.js';
import { cargarTurnos } from './services/turnoService.js';
import { cargarMedicos } from './services/medicoService.js';
import { sendError } from './utils/errorResponse.js';
import type { Turno } from './models/turno.js';

const app = express();
const servidor = http.createServer(app);
const io = new Server(servidor);

const puerto = Number(process.env.PORT ?? 3000);
const rutaDatos = path.resolve(process.env.DATA_FILE ?? './data/turnos.json');

app.use(express.json());
app.use(express.static('public'));
app.use('/turnos', turnoRouter);
app.use('/medicos', medicoRouter);

app.get('/', (_req, res) => {
  res.send('TurnosRed funcionando');
});

app.use((_req, res) => {
  sendError(res, 404, 'Recurso no encontrado', 'NOT_FOUND');
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no controlado:', error);
  sendError(res, 500, 'Error interno del servidor', 'INTERNAL_ERROR');
});

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
