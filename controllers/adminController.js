import User from '../models/User.js';
import Gym from '../models/Gym.js';

// @desc    Get overarching system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    // Run all database queries at the same time for speed
    const [totalUsers, gymGoers, gymOwners, totalGyms] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Gym.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        gymGoers,
        gymOwners,
        totalGyms
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    // Sort by newest first
    const users = await User.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all gyms
// @route   GET /api/admin/gyms
// @access  Private/Admin
export const getAllGyms = async (req, res, next) => {
  try {
    // Populate the owner field so we know who created it (if anyone)
    const gyms = await Gym.find().populate('owner', 'name email role').sort('-createdAt');
    res.status(200).json({
      success: true,
      count: gyms.length,
      data: gyms
    });
  } catch (error) {
    next(error);
  }
};