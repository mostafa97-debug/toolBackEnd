import express from 'express';
import { getTestCasesByProject } from '../controllers/testcases.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route
router.get('/projects/:projectId/testcases', authMiddleware, getTestCasesByProject);

export default router;
