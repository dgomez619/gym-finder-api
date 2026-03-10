import express from 'express';
import { getAdminStats, getAllUsers, getAllGyms } from '../controllers/adminController.js';

// IMPORT THE GUARDS
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

//  APPLY DOUBLE SECURITY TO EVERY ROUTE IN THIS FILE
// 1. Must be logged in (protect)
// 2. Must have 'admin' role (authorize('admin'))
router.use(protect);
router.use(authorize('admin'));

// Define the specific endpoints
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/gyms', getAllGyms);

export default router;