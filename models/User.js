import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a name'] 
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false 
    },
    role: { 
        type: String, 
        // FIX 1: Changed 'gym_owner' to 'owner' to match your Frontend code
        enum: ['user', 'owner', 'admin'], 
        default: 'user' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },

    // --- GAMIFICATION & STATS ---
    xp: {
        type: Number,
        default: 0
    },
    rank: {
        type: String,
        default: 'Novice' // Novice -> Scout -> Ranger -> Vanguard -> Iron Legend
    },
    // FIX 2: Removed the nested 'reputation' object and kept this top-level trustScore
    trustScore: {
        type: Number,
        default: 100 
    },
    scoutedGyms: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Gym'
    }],
    
    // Loadout / Preferences
    preferences: {
        trainingStyle: { type: String, default: 'General Fitness' },
        tags: [String] 
    }
});

// PRE-SAVE HOOK: Encrypt password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// METHOD: Generate JWT
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d' // Added fallback default
    });
};

// METHOD: Check Password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;