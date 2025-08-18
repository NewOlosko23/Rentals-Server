import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me } from '../controllers/auth.controller.js';
import { runValidation } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';

const r = Router();

r.post('/register', [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], runValidation, register);

r.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], runValidation, login);

r.get('/me', auth, me);

export default r;
