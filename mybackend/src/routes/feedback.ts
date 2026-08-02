import express from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedbackController';

const router = express.Router();

router.post('/', submitFeedback);
router.get('/', getAllFeedback);

export default router;
