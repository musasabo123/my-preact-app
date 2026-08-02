import express from 'express';
import { calculateCGPA } from '../controllers/cgpaControllers';
import { protect } from '../middleware/authMiddleware';
import { validateCGPACalculation } from '../middleware/validationMiddleware';

const router = express.Router();

router.post('/calculate', protect, validateCGPACalculation, calculateCGPA);

export default router;
