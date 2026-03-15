const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true,
  },
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Economy', 'Premium', 'XL'],
    required: [true, 'Category is required'],
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: 1,
    max: 10,
  },
  color: {
    type: String,
    default: 'White',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
