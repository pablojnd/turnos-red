import { z } from 'zod';

export const registroSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['admin', 'user']).optional(),
});

export const loginSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});
