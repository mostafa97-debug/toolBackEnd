import express from 'express';
import { getTestCasesForUser } from '../controllers/testcases.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route
router.get('/testcases', authMiddleware, getTestCasesForUser);

export default router;
