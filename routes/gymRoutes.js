import express from 'express';
import { getGyms, createGym } from '../controllers/gymController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// When a GET request hits the route, run getGyms. 
// When a POST request hits the route, run createGym.
router.route('/')
  .get(getGyms)
  .post(protect, createGym);

export default router;