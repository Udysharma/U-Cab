const Driver = require('../models/Driver');
const Ride = require('../models/Ride');

/**
 * Find nearby available drivers within a radius
 */
async function findNearbyDrivers(lat, lng, cabType = null, radiusKm = 5) {
  const query = {
    isAvailable: true,
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat], // GeoJSON: [lng, lat]
        },
        $maxDistance: radiusKm * 1000, // Convert to meters
      },
    },
  };

  if (cabType) {
    query.cabType = cabType;
  }

  const drivers = await Driver.find(query).limit(10);
  return drivers;
}

/**
 * Assign the closest available driver to a ride
 */
async function assignDriver(rideId) {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new Error('Ride not found');

  const drivers = await findNearbyDrivers(
    ride.pickup.lat,
    ride.pickup.lng,
    ride.cabType,
    10
  );

  if (drivers.length === 0) {
    // Fallback: get any available driver of the same cab type
    const fallbackDriver = await Driver.findOne({
      isAvailable: true,
      cabType: ride.cabType,
    });

    if (!fallbackDriver) throw new Error('No drivers available');

    fallbackDriver.isAvailable = false;
    fallbackDriver.currentRide = rideId;
    await fallbackDriver.save();

    ride.driverId = fallbackDriver._id;
    ride.status = 'accepted';
    ride.driverLocation = {
      lat: fallbackDriver.location.coordinates[1],
      lng: fallbackDriver.location.coordinates[0],
    };
    await ride.save();

    return fallbackDriver;
  }

  const driver = drivers[0]; // Closest driver
  driver.isAvailable = false;
  driver.currentRide = rideId;
  await driver.save();

  ride.driverId = driver._id;
  ride.status = 'accepted';
  ride.driverLocation = {
    lat: driver.location.coordinates[1],
    lng: driver.location.coordinates[0],
  };
  await ride.save();

  return driver;
}

module.exports = { findNearbyDrivers, assignDriver };
