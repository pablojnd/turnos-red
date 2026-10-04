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
import { verificarToken } from '../middleware/verificarToken.js';

export const turnoRouter = Router();

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Obtener todos los turnos
 *     description: Lista turnos, con filtros opcionales por query params.
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: string
 *         description: Filtrar por especialidad
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *         description: Filtrar por fecha (DD/MM/YYYY o YYYY-MM-DD)
 *       - in: query
 *         name: medicoId
 *         schema:
 *           type: integer
 *         description: Filtrar por id de médico
 *     responses:
 *       200:
 *         description: Lista de turnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Request inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
turnoRouter.get('/', listar);

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
turnoRouter.get('/:id', obtener);

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 oneOf:
 *                   - type: string
 *                   - type: integer
 *               paciente:
 *                 type: string
 *               documento:
 *                 type: string
 *               especialidad:
 *                 type: string
 *                 enum: ['Clínica médica', 'Pediatría', 'Odontología', 'Nutrición']
 *               fecha:
 *                 type: string
 *               hora:
 *                 type: string
 *               confirmado:
 *                 type: boolean
 *               observaciones:
 *                 type: string
 *               medicoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Turno creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       401:
 *         description: Token faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Datos inválidos (validación Zod) o ID repetido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
turnoRouter.post('/', verificarToken, validateBody(crearTurnoSchema), crear);

/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Actualizar un turno existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paciente:
 *                 type: string
 *               documento:
 *                 type: string
 *               especialidad:
 *                 type: string
 *                 enum: ['Clínica médica', 'Pediatría', 'Odontología', 'Nutrición']
 *               fecha:
 *                 type: string
 *               hora:
 *                 type: string
 *               confirmado:
 *                 type: boolean
 *               observaciones:
 *                 type: string
 *               medicoId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Turno actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       401:
 *         description: Token faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
turnoRouter.put(
  '/:id',
  verificarToken,
  validateBody(actualizarTurnoSchema),
  actualizar,
);

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Eliminar un turno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Turno eliminado
 *       401:
 *         description: Token faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
turnoRouter.delete('/:id', verificarToken, eliminar);
