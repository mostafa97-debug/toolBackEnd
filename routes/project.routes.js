import { Router } from 'express';
const router = Router();
import { getProjectsForUser } from '../controllers/project.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
router.get('/projects', authMiddleware, getProjectsForUser);

export default router;
