import { Router } from 'express';
import { login, registro } from '../controllers/authController.js';
import { loginSchema, registroSchema } from '../schemas/authSchemas.js';
import { validateBody } from '../schemas/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRouter = Router();

authRouter.post(
  '/registro',
  validateBody(registroSchema),
  asyncHandler(async (req, res) => {
    await registro(req, res);
  }),
);

authRouter.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    await login(req, res);
  }),
);
