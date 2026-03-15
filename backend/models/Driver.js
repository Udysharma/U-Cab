const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  cabType: {
    type: String,
    enum: ['Economy', 'Premium', 'XL'],
    required: [true, 'Cab type is required'],
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
  },
  vehicleModel: {
    type: String,
    default: 'Sedan',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [77.209, 28.6139],
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
  },
  currentRide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// GeoJSON index for geospatial queries
driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
