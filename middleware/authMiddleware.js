import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the "Authorization" header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get the token from the header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user associated with this token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
      }

      return next(); // ✅ RETURN here to exit early
    } catch (error) {
      console.error("🔴 Auth Error:", error.message);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  // Only reach here if no Authorization header
  return res.status(401).json({ success: false, error: 'Not authorized, no token' });
};

export { protect };