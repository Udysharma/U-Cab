import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Anav from './Anav';
import { adminGetBookings } from '../../services/api';
import './Ahome.css';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await adminGetBookings();
      setBookings(res.data);
    } catch (err) {
      console.error('Bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <Anav />
      <div className="admin-page page-wrapper">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="admin-page-header">
              <h1>All Bookings</h1>
              <span className="badge badge-accepted">{bookings.length} bookings</span>
            </div>

            {loading ? <div className="spinner"></div> : (
              <div className="admin-table-wrapper glass-card" style={{ padding: 0 }}>
                <table className="admin-table" id="bookings-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Pickup</th>
                      <th>Dropoff</th>
                      <th>Cab Type</th>
                      <th>Fare</th>
                      <th>Status</th>
                      <th>Driver</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.userId?.name || '—'}</td>
                        <td>{b.pickup?.address || '—'}</td>
                        <td>{b.dropoff?.address || '—'}</td>
                        <td>{b.cabType}</td>
                        <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>₹{b.fare?.total}</td>
                        <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                        <td>{b.driverId?.name || '—'}</td>
                        <td>{formatDate(b.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
