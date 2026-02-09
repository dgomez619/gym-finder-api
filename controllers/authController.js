import User from '../models/User.js';

// Helper function to send token
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken(); // Get the wristband

  res.status(statusCode).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user in DB (password gets encrypted automatically)
    const user = await User.create({ name, email, password, role });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });

    // 2. Find user in DB and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    // 3. Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    // 4. Send token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get current logged in user (with full stats)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('scoutedGyms');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};