import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a gym name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },

  // Map Coordinates (GeoJSON format)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true,
      index: '2dsphere' // Triggers MongoDB's internal map engine
    },
    formattedAddress: String
  },

  // Equipment & Amenities
  equipment: {
    hasSquatRack: { type: Boolean, default: false },
    hasDeadliftPlatform: { type: Boolean, default: false },
    maxDumbbellWeight: { type: Number, default: 0 } // in KG
  },
  amenities: {
    hasAC: { type: Boolean, default: false },
    hasShowers: { type: Boolean, default: false }
  },

  // Pricing
  dayPassPrice: { type: Number, required: true },
  
  // Link to the user who created it
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Gym = mongoose.model('Gym', gymSchema);
export default Gym;