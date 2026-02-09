import Gym from '../models/Gym.js';
import User from '../models/User.js'; // <--- FIX 1: Use 'import', not 'require'

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

// @desc    Create new gym
// @route   POST /api/gyms
// @access  Private
// FIX 2: Use 'export const', not 'exports.createGym ='
export const createGym = async (req, res, next) => {
  try {
    // Add user to req.body so the gym knows who owns it
    req.body.owner = req.user.id; 

    // 1. Create the Gym
    const gym = await Gym.create(req.body);

    // 2. GAMIFICATION: Reward the User
    // Find the user to update their stats
    const user = await User.findById(req.user.id);
    
    if (user) {
      // Add XP
      user.xp = (user.xp || 0) + 50;
      
      // Add to 'Scouted Gyms' history if it exists in schema
      if (user.scoutedGyms) {
        user.scoutedGyms.push(gym._id);
      }

      // Calculate Rank Logic
      if (user.xp >= 1000) user.rank = 'Iron Legend';
      else if (user.xp >= 500) user.rank = 'Vanguard';
      else if (user.xp >= 250) user.rank = 'Ranger';
      else if (user.xp >= 100) user.rank = 'Scout';

      await user.save(); 
    }

    res.status(201).json({
      success: true,
      data: gym,
      xpEarned: 50 
    });
  } catch (err) {
    // If duplicate gym name
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Gym with this name already exists' });
    }
    // Pass to global error handler if you have one, or just send error
    res.status(400).json({ success: false, error: err.message });
  }
};