import { Router } from 'express';
import {
  actualizar,
  crear,
  eliminar,
  listar,
  obtener,
} from '../controllers/turnoController.js';
import {
  actualizarTurnoSchema,
  crearTurnoSchema,
} from '../schemas/turnoSchemas.js';
import { validateBody } from '../schemas/validate.js';

export const turnoRouter = Router();

turnoRouter.get('/', listar);
turnoRouter.get('/:id', obtener);
turnoRouter.post('/', validateBody(crearTurnoSchema), crear);
turnoRouter.put('/:id', validateBody(actualizarTurnoSchema), actualizar);
turnoRouter.delete('/:id', eliminar);
