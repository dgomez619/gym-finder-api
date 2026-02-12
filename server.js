import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

// routes
import gymRoutes from './routes/gymRoutes.js';
import authRoutes from './routes/authRoutes.js'; 

// Load env variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // Allows us to accept JSON data in requests

// Add your Netlify URL here so it can talk to the backend
const allowedOrigins = [
  "http://localhost:5173",             // Local frontend
  "https://mapagym.netlify.app"      // Live Netlify frontend
];

app.use(cors({
  origin: allowedOrigins
}));

app.use(morgan('dev')); // Logs requests to the console

// Mount routes
app.use('/api/gyms', gymRoutes);
app.use('/api/auth', authRoutes);

// ----------------------------------------------
// 🔴 ADD THIS ERROR HANDLER 🔴
// ---------------------------------------------- 
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);

  // If status code hasn't been set, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Server Error"
  });
});

// A simple test route to make sure it's alive
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Gym Finder API is running.' 
  });
});

// Start the server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});