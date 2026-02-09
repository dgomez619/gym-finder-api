import express from 'express';

// 1. IMPORT THE CONTROLLERS (register, login, getMe)
import { register, login, getMe } from '../controllers/authController.js';

// 2. IMPORT THE MIDDLEWARE (protect)
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// When a POST request hits /register, run register.
router.post('/register', register);

// When a POST request hits /login, run login.
router.post('/login', login);

// When a GET request hits /me, run getMe (but only if protect middleware allows it).
router.get('/me', protect, getMe);

export default router;