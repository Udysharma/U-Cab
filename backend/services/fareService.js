// Fare rates per km by cab type
const RATES = {
  Economy: { baseFare: 30, perKm: 8 },
  Premium: { baseFare: 50, perKm: 14 },
  XL:      { baseFare: 70, perKm: 18 },
};

// Discount codes
const DISCOUNTS = {
  UCAB20:  { percentage: 20, maxDiscount: 100 },
  FIRST50: { percentage: 50, maxDiscount: 200 },
  RIDE10:  { percentage: 10, maxDiscount: 50 },
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculate fare for a ride
 */
function calculateFare(pickupLat, pickupLng, dropoffLat, dropoffLng, cabType, discountCode) {
  const distance = calculateDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
  const rate = RATES[cabType] || RATES.Economy;

  const baseFare = rate.baseFare;
  const distanceCharge = Math.round(distance * rate.perKm);
  let subtotal = baseFare + distanceCharge;

  let discount = 0;
  if (discountCode && DISCOUNTS[discountCode.toUpperCase()]) {
    const disc = DISCOUNTS[discountCode.toUpperCase()];
    discount = Math.min(Math.round(subtotal * disc.percentage / 100), disc.maxDiscount);
  }

  const total = Math.max(subtotal - discount, 0);
  const eta = Math.max(Math.round(distance * 2.5), 5); // ~2.5 min per km, min 5 min

  return { baseFare, distanceCharge, discount, total, distance, eta };
}

module.exports = { calculateFare, calculateDistance, RATES, DISCOUNTS };
