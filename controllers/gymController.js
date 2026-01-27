import Gym from '../models/Gym.js';

// @desc    Get all gyms
// @route   GET /api/gyms
// @access  Public
export const getGyms = async (req, res) => {
  try {
    const gyms = await Gym.find();

    res.status(200).json({
      success: true,
      count: gyms.length,
      data: gyms
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create a new gym
// @route   POST /api/gyms
// @access  Private (We will secure this later, public for testing)
export const createGym = async (req, res) => {
  try {
    const gym = await Gym.create(req.body);

    res.status(201).json({
      success: true,
      data: gym
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};