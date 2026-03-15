const express = require('express');
const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const { calculateFare } = require('../services/fareService');
const { findNearbyDrivers, assignDriver } = require('../services/rideMatchingService');
const { getRideStatus, updateRideStatus, simulateDriverMovement } = require('../services/trackingService');

const router = express.Router();

// POST /api/rides/book – Book a new ride
router.post('/book', protect, async (req, res) => {
  try {
    const { pickup, dropoff, cabType, discountCode } = req.body;

    // Calculate fare
    const fareResult = calculateFare(
      pickup.lat, pickup.lng,
      dropoff.lat, dropoff.lng,
      cabType,
      discountCode
    );

    // Create ride
    const ride = await Ride.create({
      userId: req.user._id,
      pickup,
      dropoff,
      cabType,
      fare: {
        baseFare: fareResult.baseFare,
        distanceCharge: fareResult.distanceCharge,
        discount: fareResult.discount,
        total: fareResult.total,
      },
      distance: fareResult.distance,
      eta: fareResult.eta,
      discountCode: discountCode || null,
    });

    // Try to assign a driver
    try {
      const driver = await assignDriver(ride._id);
      const updatedRide = await Ride.findById(ride._id).populate('driverId', 'name phone cabType vehicleNumber vehicleModel rating');
      res.status(201).json(updatedRide);
    } catch (driverError) {
      // No driver found, ride stays in 'requested' status
      res.status(201).json({ ...ride.toObject(), driverMessage: 'Searching for nearby drivers...' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/rides/nearby-drivers – Find nearby drivers
router.get('/nearby-drivers', protect, async (req, res) => {
  try {
    const { lat, lng, cabType } = req.query;
    const drivers = await findNearbyDrivers(
      parseFloat(lat),
      parseFloat(lng),
      cabType || null
    );
    res.json(drivers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/rides/history/:userId – User's ride history
router.get('/history/:userId', protect, async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.params.userId })
      .populate('driverId', 'name cabType vehicleNumber rating')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/rides/:id – Get single ride (for tracking)
router.get('/:id', protect, async (req, res) => {
  try {
    const rideStatus = await getRideStatus(req.params.id);
    res.json(rideStatus);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// PUT /api/rides/:id – Update ride status
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await updateRideStatus(req.params.id, status);

    // If completed, create a transaction
    if (status === 'completed') {
      await Transaction.create({
        rideId: ride._id,
        userId: ride.userId,
        amount: ride.fare.total,
        method: 'card',
        status: 'completed',
      });
    }

    res.json(ride);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/rides/:id – Cancel a ride
router.delete('/:id', protect, async (req, res) => {
  try {
    const ride = await updateRideStatus(req.params.id, 'cancelled');
    res.json({ message: 'Ride cancelled', ride });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/rides/fare-estimate – Get fare estimate without booking
router.post('/fare-estimate', protect, async (req, res) => {
  try {
    const { pickup, dropoff, cabType, discountCode } = req.body;
    const fareResult = calculateFare(
      pickup.lat, pickup.lng,
      dropoff.lat, dropoff.lng,
      cabType,
      discountCode
    );
    res.json(fareResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
