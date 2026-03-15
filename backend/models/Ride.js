const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },
  pickup: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  dropoff: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  cabType: {
    type: String,
    enum: ['Economy', 'Premium', 'XL'],
    required: true,
  },
  fare: {
    baseFare: { type: Number, default: 0 },
    distanceCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  distance: {
    type: Number, // in km
    default: 0,
  },
  eta: {
    type: Number, // in minutes
    default: 0,
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'requested',
  },
  discountCode: {
    type: String,
    default: null,
  },
  driverLocation: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Ride', rideSchema);
