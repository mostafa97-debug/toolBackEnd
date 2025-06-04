import express from 'express';
import { submitAutomationRequest } from '../controllers/submitRequestController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route
router.post('/submitRequest', authMiddleware, submitAutomationRequest);

export default router;
