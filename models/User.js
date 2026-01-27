import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'] },
  email: { 
    type: String, 
    required: [true, 'Please add an email'], 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Please add a password'], 
    minlength: 6,
    select: false // Crucial: Never return password in API responses
  },
  role: { type: String, enum: ['user', 'gym_owner', 'admin'], default: 'user' },
  reputation: { points: { type: Number, default: 0 }, trustScore: { type: Number, default: 1 } },
  createdAt: { type: Date, default: Date.now }
});

// PRE-SAVE HOOK: Encrypt password using bcrypt before saving to DB
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// METHOD: Generate the JWT Token (The Wristband)
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// METHOD: Check if entered password matches the encrypted one in DB
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;