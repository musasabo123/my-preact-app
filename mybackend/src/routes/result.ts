import express from 'express';
import { saveResult, getResults } from '../controllers/resultController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Save a result
router.post('/save', protect, saveResult);

// Get all results for a user
router.get('/user', protect, getResults);

export default router;
