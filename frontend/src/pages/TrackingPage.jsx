import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import DriverCard from '../components/DriverCard';
import RideTimer from '../components/RideTimer';
import { getRide, updateRide, cancelRide } from '../services/api';
import './TrackingPage.css';

const statusSteps = ['requested', 'accepted', 'in-progress', 'completed'];

export default function TrackingPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRide();
    const interval = setInterval(fetchRide, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [rideId]);

  const fetchRide = async () => {
    try {
      const res = await getRide(rideId);
      setRide(res.data);
    } catch (err) {
      console.error('Failed to fetch ride:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await updateRide(rideId, { status });
      fetchRide();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelRide(rideId);
      navigate('/dashboard');
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  if (loading) return <div className="page-wrapper"><div className="spinner"></div></div>;
  if (!ride) return <div className="page-wrapper"><div className="empty-state"><h3>Ride not found</h3></div></div>;

  const currentStep = statusSteps.indexOf(ride.status);

  return (
    <div className="tracking-page page-wrapper">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="tracking-title">Ride Tracking</h1>

          {/* Status Progress */}
          <div className="status-progress glass-card" id="ride-status">
            <div className="progress-steps">
              {statusSteps.map((step, i) => (
                <div key={step} className={`progress-step ${i <= currentStep ? 'active' : ''} ${ride.status === 'cancelled' ? 'cancelled' : ''}`}>
                  <div className="step-dot">{i <= currentStep ? '✓' : i + 1}</div>
                  <span className="step-label">{step.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${ride.status === 'cancelled' ? 0 : (currentStep / (statusSteps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="tracking-layout">
            {/* Map Simulation */}
            <div className="tracking-map glass-card" id="tracking-map">
              <div className="map-placeholder">
                <div className="map-route">
                  <div className="map-point pickup">
                    <span className="map-pin">📍</span>
                    <span>{ride.pickup?.address || 'Pickup'}</span>
                  </div>
                  <div className="map-line">
                    <div className="map-car" style={{ left: `${Math.min(currentStep / 3 * 100, 100)}%` }}>
                      🚕
                    </div>
                  </div>
                  <div className="map-point dropoff">
                    <span className="map-pin">🏁</span>
                    <span>{ride.dropoff?.address || 'Destination'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="tracking-sidebar">
              {/* Driver Info */}
              {ride.driver && <DriverCard driver={ride.driver} />}

              {/* ETA Timer */}
              {ride.status !== 'completed' && ride.status !== 'cancelled' && ride.eta > 0 && (
                <div className="glass-card">
                  <RideTimer eta={ride.eta} />
                </div>
              )}

              {/* Fare Summary */}
              <div className="fare-summary glass-card">
                <h3>Fare Details</h3>
                <div className="fare-row"><span>Distance</span><span>{ride.distance} km</span></div>
                <div className="fare-row"><span>Base Fare</span><span>₹{ride.fare?.baseFare}</span></div>
                <div className="fare-row"><span>Distance Charge</span><span>₹{ride.fare?.distanceCharge}</span></div>
                {ride.fare?.discount > 0 && (
                  <div className="fare-row discount"><span>Discount</span><span>-₹{ride.fare?.discount}</span></div>
                )}
                <div className="fare-row total"><span>Total</span><span>₹{ride.fare?.total}</span></div>
              </div>

              {/* Actions */}
              <div className="tracking-actions">
                {ride.status === 'accepted' && (
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleUpdateStatus('in-progress')}>
                    <FiCheckCircle /> Start Ride
                  </button>
                )}
                {ride.status === 'in-progress' && (
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleUpdateStatus('completed')}>
                    <FiCheckCircle /> Complete Ride
                  </button>
                )}
                {ride.status !== 'completed' && ride.status !== 'cancelled' && (
                  <button className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: '8px' }} onClick={handleCancel}>
                    <FiXCircle /> Cancel Ride
                  </button>
                )}
                {(ride.status === 'completed' || ride.status === 'cancelled') && (
                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/dashboard')}>
                    Book Another Ride
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
