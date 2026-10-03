import { Router } from 'express';
import {
  actualizar,
  crear,
  eliminar,
  listar,
  obtener,
} from '../controllers/turnoController.js';

export const turnoRouter = Router();

turnoRouter.get('/', listar);
turnoRouter.get('/:id', obtener);
turnoRouter.post('/', crear);
turnoRouter.put('/:id', actualizar);
turnoRouter.delete('/:id', eliminar);
