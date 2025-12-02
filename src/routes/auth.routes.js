import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation, handleValidationErrors } from '../validators/auth.validator.js';

const router = express.Router();

router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  register
);

router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  login
);

export default router;