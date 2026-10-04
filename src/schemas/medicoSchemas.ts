import { z } from 'zod';
import { especialidadSchema } from './turnoSchemas.js';

const baseMedico = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  especialidad: especialidadSchema,
  disponible: z.union([z.boolean(), z.number(), z.string()]),
});

export const crearMedicoSchema = baseMedico.extend({
  id: z.union([z.string(), z.number()]),
});

export const actualizarMedicoSchema = baseMedico;
