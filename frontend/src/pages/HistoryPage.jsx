import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiMapPin, FiNavigation } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getRideHistory } from '../services/api';
import './HistoryPage.css';

export default function HistoryPage() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getRideHistory(user._id);
      setRides(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="history-page page-wrapper">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title">Ride History</h1>

          {loading ? (
            <div className="spinner"></div>
          ) : rides.length === 0 ? (
            <div className="empty-state">
              <h3>No rides yet</h3>
              <p>Your ride history will appear here</p>
              <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Book Your First Ride
              </Link>
            </div>
          ) : (
            <div className="history-list">
              {rides.map((ride, i) => (
                <motion.div
                  key={ride._id}
                  className="history-item glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="history-item-header">
                    <div className="history-item-type">
                      <span className="history-cab-icon">
                        {ride.cabType === 'Economy' ? '🚗' : ride.cabType === 'Premium' ? '🚘' : '🚐'}
                      </span>
                      <div>
                        <h3>{ride.cabType}</h3>
                        <span className="history-date"><FiClock /> {formatDate(ride.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`badge badge-${ride.status}`}>{ride.status}</span>
                  </div>

                  <div className="history-route">
                    <div className="history-point">
                      <FiMapPin className="pickup-icon" />
                      <span>{ride.pickup?.address || 'Pickup Location'}</span>
                    </div>
                    <div className="history-point">
                      <FiNavigation className="dropoff-icon" />
                      <span>{ride.dropoff?.address || 'Destination'}</span>
                    </div>
                  </div>

                  <div className="history-footer">
                    <span className="history-distance">{ride.distance} km</span>
                    <span className="history-fare">₹{ride.fare?.total}</span>
                    {ride.driverId && (
                      <span className="history-driver">{ride.driverId?.name}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
