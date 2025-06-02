import express from 'express';
import { getModulesByProject } from '../controllers/modules.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route
router.get('/modules', authMiddleware, getModulesByProject);

export default router;
