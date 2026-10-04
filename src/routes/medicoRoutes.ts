import { Router } from 'express';
import {
  actualizar,
  crear,
  eliminar,
  listar,
  obtener,
} from '../controllers/medicoController.js';
import {
  actualizarMedicoSchema,
  crearMedicoSchema,
} from '../schemas/medicoSchemas.js';
import { validateBody } from '../schemas/validate.js';

export const medicoRouter = Router();

medicoRouter.get('/', listar);
medicoRouter.get('/:id', obtener);
medicoRouter.post('/', validateBody(crearMedicoSchema), crear);
medicoRouter.put('/:id', validateBody(actualizarMedicoSchema), actualizar);
medicoRouter.delete('/:id', eliminar);
