import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiNavigation, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import CabCard from '../components/CabCard';
import NearbyCab from '../components/NearbyCab';
import BookingModal from '../components/BookingModal';
import { getNearbyDrivers, getFareEstimate, bookRide } from '../services/api';
import './Dashboard.css';

const cabRates = { Economy: 8, Premium: 14, XL: 18 };

export default function Dashboard() {
  const { user } = useAuth();
  const {
    pickup, setPickup, dropoff, setDropoff,
    selectedCabType, setSelectedCabType,
    fareEstimate, setFareEstimate,
    currentBooking, setCurrentBooking,
  } = useBooking();
  const navigate = useNavigate();

  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [driversLoading, setDriversLoading] = useState(false);

  useEffect(() => {
    fetchNearbyDrivers();
  }, []);

  const fetchNearbyDrivers = async () => {
    setDriversLoading(true);
    try {
      const res = await getNearbyDrivers(pickup.lat, pickup.lng);
      setNearbyDrivers(res.data);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
    } finally {
      setDriversLoading(false);
    }
  };

  const handleGetEstimate = async () => {
    if (!pickup.address || !dropoff.address) return;
    try {
      const res = await getFareEstimate({ pickup, dropoff, cabType: selectedCabType });
      setFareEstimate(res.data);
      setShowModal(true);
    } catch (err) {
      console.error('Fare estimate error:', err);
    }
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const res = await bookRide({
        pickup, dropoff, cabType: selectedCabType,
      });
      setCurrentBooking(res.data);
      navigate(`/tracking/${res.data._id}`);
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="dashboard page-wrapper">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-greeting"
        >
          <h1>Hello, <span className="hero-gradient">{user?.name?.split(' ')[0]}</span> 👋</h1>
          <p>Where would you like to go today?</p>
        </motion.div>

        <div className="dashboard-layout">
          {/* Booking Form */}
          <motion.div
            className="booking-panel glass-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="panel-title">Book a Ride</h2>

            <div className="location-inputs">
              <div className="location-input-group">
                <span className="location-dot pickup-dot"></span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pickup location"
                  value={pickup.address}
                  onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
                  id="pickup-input"
                />
              </div>
              <div className="location-connector"></div>
              <div className="location-input-group">
                <span className="location-dot dropoff-dot"></span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Where to?"
                  value={dropoff.address}
                  onChange={(e) => setDropoff({ ...dropoff, address: e.target.value })}
                  id="dropoff-input"
                />
              </div>
            </div>

            <h3 className="panel-subtitle">Choose Cab Type</h3>
            <div className="cab-type-list">
              {Object.entries(cabRates).map(([type, rate]) => (
                <CabCard
                  key={type}
                  type={type}
                  rate={rate}
                  selected={selectedCabType === type}
                  onClick={() => setSelectedCabType(type)}
                />
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '20px' }}
              onClick={handleGetEstimate}
              disabled={!pickup.address || !dropoff.address}
              id="get-estimate-btn"
            >
              <FiSearch /> Get Fare Estimate
            </button>
          </motion.div>

          {/* Nearby Drivers */}
          <motion.div
            className="drivers-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="panel-title">Nearby Drivers</h2>
            {driversLoading ? (
              <div className="spinner"></div>
            ) : nearbyDrivers.length === 0 ? (
              <div className="empty-state">
                <h3>No drivers nearby</h3>
                <p>Try again in a moment</p>
              </div>
            ) : (
              <div className="drivers-list">
                {nearbyDrivers.map((driver) => (
                  <NearbyCab key={driver._id} driver={driver} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <BookingModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmBooking}
        loading={loading}
        booking={{
          pickup, dropoff, cabType: selectedCabType,
          fare: fareEstimate,
        }}
      />
    </div>
  );
}
