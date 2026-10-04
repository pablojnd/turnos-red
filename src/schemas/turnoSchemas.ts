import { z } from 'zod';

export const especialidadSchema = z
  .string()
  .trim()
  .regex(
    /^[A-ZÁÉÍÓÚÑ][A-Za-záéíóúñ]*( [A-Za-záéíóúñ]+)*$/,
    'Debe usar formato Title Case (ej. "Clínica médica", "Pediatría")',
  );

const baseTurno = z.object({
  paciente: z.string().trim().min(1, 'El paciente es obligatorio'),
  documento: z
    .union([z.string(), z.number()])
    .transform((valor) => String(valor).trim())
    .pipe(z.string().min(1, 'El documento es obligatorio')),
  especialidad: especialidadSchema,
  fecha: z
    .string()
    .trim()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato esperado DD/MM/YYYY'),
  hora: z
    .string()
    .trim()
    .regex(/^\d{1,2}[:.]\d{2}$/, 'Formato esperado HH:MM o HH.MM'),
  confirmado: z.union([z.boolean(), z.number(), z.string()]),
  observaciones: z.string().trim().optional(),
  medicoId: z.union([z.string(), z.number()]).optional(),
});

export const crearTurnoSchema = baseTurno.extend({
  id: z.union([z.string(), z.number()]),
});

export const actualizarTurnoSchema = baseTurno;
