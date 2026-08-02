import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authControllers';
import { protect } from '../middleware/authMiddleware';
import { validateRegistration, validateLogin } from '../middleware/validationMiddleware';

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
