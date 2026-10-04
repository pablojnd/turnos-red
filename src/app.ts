import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { turnoRouter } from './routes/turnoRoutes.js';
import { medicoRouter } from './routes/medicoRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { sendError } from './utils/errorResponse.js';
import { logger } from './config/logger.js';

export const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
);
app.use(express.json());
app.use(express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRouter);
app.use('/turnos', turnoRouter);
app.use('/medicos', medicoRouter);

app.get('/', (_req, res) => {
  res.send('TurnosRed funcionando');
});

app.use((_req, res) => {
  sendError(res, 404, 'Recurso no encontrado', 'RESOURCE_NOT_FOUND');
});

app.use(
  (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ error }, 'Error no controlado');

    if (error instanceof SyntaxError) {
      sendError(res, 400, 'JSON inválido en el cuerpo', 'VALIDATION_ERROR');
      return;
    }

    sendError(res, 500, 'Error interno del servidor', 'INTERNAL_ERROR');
  },
);
