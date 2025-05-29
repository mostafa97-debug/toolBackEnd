import { Router } from 'express';
const router = Router();
import { login } from '../controllers/auth.controller.js';
import { register } from '../controllers/auth.controller.js';

router.post('/login', login);
router.post('/register', register);

export default router;
