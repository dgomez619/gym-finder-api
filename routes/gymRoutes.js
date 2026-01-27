import express from 'express';
import { getGyms, createGym } from '../controllers/gymController.js';

const router = express.Router();

// When a GET request hits the route, run getGyms. 
// When a POST request hits the route, run createGym.
router.route('/')
  .get(getGyms)
  .post(createGym);

export default router;