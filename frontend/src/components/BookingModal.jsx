import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiNavigation } from 'react-icons/fi';
import './BookingModal.css';

export default function BookingModal({ show, onClose, onConfirm, booking, loading }) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content glass-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          id="booking-modal"
        >
          <button className="modal-close" onClick={onClose}><FiX /></button>

          <h2 className="modal-title">Confirm Your Ride</h2>

          <div className="modal-route">
            <div className="route-point">
              <span className="route-dot pickup-dot"></span>
              <div>
                <label>Pickup</label>
                <p>{booking?.pickup?.address || 'Current Location'}</p>
              </div>
            </div>
            <div className="route-line"></div>
            <div className="route-point">
              <span className="route-dot dropoff-dot"></span>
              <div>
                <label>Dropoff</label>
                <p>{booking?.dropoff?.address || 'Destination'}</p>
              </div>
            </div>
          </div>

          <div className="modal-details">
            <div className="detail-row">
              <span>Cab Type</span>
              <span className="detail-value">{booking?.cabType}</span>
            </div>
            <div className="detail-row">
              <span>Distance</span>
              <span className="detail-value">{booking?.fare?.distance} km</span>
            </div>
            <div className="detail-row">
              <span>ETA</span>
              <span className="detail-value">{booking?.fare?.eta} min</span>
            </div>
            <div className="detail-row">
              <span>Base Fare</span>
              <span className="detail-value">₹{booking?.fare?.baseFare}</span>
            </div>
            <div className="detail-row">
              <span>Distance Charge</span>
              <span className="detail-value">₹{booking?.fare?.distanceCharge}</span>
            </div>
            {booking?.fare?.discount > 0 && (
              <div className="detail-row discount">
                <span>Discount</span>
                <span className="detail-value">-₹{booking?.fare?.discount}</span>
              </div>
            )}
            <div className="detail-row total">
              <span>Total</span>
              <span className="detail-value">₹{booking?.fare?.total}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={onConfirm}
            disabled={loading}
            id="confirm-booking-btn"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
