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
import { verificarToken } from '../middleware/verificarToken.js';

export const medicoRouter = Router();

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Obtener todos los médicos
 *     description: Lista médicos, con filtros opcionales por query params.
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: string
 *         description: Filtrar por especialidad
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filtrar por disponibilidad
 *     responses:
 *       200:
 *         description: Lista de médicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Medico'
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
medicoRouter.get('/', listar);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Obtener un médico por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Médico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Médico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
medicoRouter.get('/:id', obtener);

/**
 * @swagger
 * /medicos:
 *   post:
 *     summary: Registrar un nuevo médico
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
 *               nombre:
 *                 type: string
 *               especialidad:
 *                 type: string
 *                 enum: ['Clínica médica', 'Pediatría', 'Odontología', 'Nutrición']
 *               disponible:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Médico creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
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
medicoRouter.post('/', verificarToken, validateBody(crearMedicoSchema), crear);

/**
 * @swagger
 * /medicos/{id}:
 *   put:
 *     summary: Actualizar un médico existente
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
 *               nombre:
 *                 type: string
 *               especialidad:
 *                 type: string
 *                 enum: ['Clínica médica', 'Pediatría', 'Odontología', 'Nutrición']
 *               disponible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Médico actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
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
 *         description: Médico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
medicoRouter.put(
  '/:id',
  verificarToken,
  validateBody(actualizarMedicoSchema),
  actualizar,
);

/**
 * @swagger
 * /medicos/{id}:
 *   delete:
 *     summary: Dar de baja un médico
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
 *         description: Médico eliminado
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
 *         description: Médico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
medicoRouter.delete('/:id', verificarToken, eliminar);
