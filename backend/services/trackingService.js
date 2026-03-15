const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

/**
 * Get the current status and details of a ride
 */
async function getRideStatus(rideId) {
  const ride = await Ride.findById(rideId)
    .populate('userId', 'name email phone')
    .populate('driverId', 'name phone cabType vehicleNumber vehicleModel rating');

  if (!ride) throw new Error('Ride not found');

  return {
    id: ride._id,
    status: ride.status,
    pickup: ride.pickup,
    dropoff: ride.dropoff,
    fare: ride.fare,
    distance: ride.distance,
    eta: ride.eta,
    driver: ride.driverId,
    user: ride.userId,
    driverLocation: ride.driverLocation,
    createdAt: ride.createdAt,
    completedAt: ride.completedAt,
  };
}

/**
 * Update ride status through its lifecycle
 */
async function updateRideStatus(rideId, newStatus) {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new Error('Ride not found');

  const validTransitions = {
    requested: ['accepted', 'cancelled'],
    accepted: ['in-progress', 'cancelled'],
    'in-progress': ['completed', 'cancelled'],
  };

  const allowed = validTransitions[ride.status];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(`Cannot transition from ${ride.status} to ${newStatus}`);
  }

  ride.status = newStatus;

  if (newStatus === 'completed') {
    ride.completedAt = new Date();
    // Free up the driver
    if (ride.driverId) {
      await Driver.findByIdAndUpdate(ride.driverId, {
        isAvailable: true,
        currentRide: null,
      });
    }
  }

  if (newStatus === 'cancelled') {
    // Free up the driver
    if (ride.driverId) {
      await Driver.findByIdAndUpdate(ride.driverId, {
        isAvailable: true,
        currentRide: null,
      });
    }
  }

  await ride.save();
  return ride;
}

/**
 * Simulate driver movement toward pickup/dropoff (for demo)
 */
function simulateDriverMovement(driverLat, driverLng, targetLat, targetLng, progress) {
  // Linear interpolation between driver and target
  const lat = driverLat + (targetLat - driverLat) * progress;
  const lng = driverLng + (targetLng - driverLng) * progress;
  return { lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000 };
}

module.exports = { getRideStatus, updateRideStatus, simulateDriverMovement };
