import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTruck, FiClipboard, FiDollarSign, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';
import Anav from './Anav';
import { adminGetStats } from '../../services/api';
import './Ahome.css';

export default function Ahome() {
  const { admin } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminGetStats();
      setStats(res.data);
    } catch (err) {
      console.error('Stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: <FiUsers />, color: '#3b82f6' },
    { label: 'Total Drivers', value: stats.totalDrivers, icon: <FiUsers />, color: '#8b5cf6' },
    { label: 'Total Rides', value: stats.totalRides, icon: <FiClipboard />, color: '#f59e0b' },
    { label: 'Total Vehicles', value: stats.totalVehicles, icon: <FiTruck />, color: '#6366f1' },
    { label: 'Completed Rides', value: stats.completedRides, icon: <FiCheckCircle />, color: '#22c55e' },
    { label: 'Cancelled Rides', value: stats.cancelledRides, icon: <FiXCircle />, color: '#ef4444' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: <FiDollarSign />, color: '#f59e0b' },
  ] : [];

  return (
    <div>
      <Anav />
      <div className="admin-page page-wrapper">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="admin-greeting">Welcome, <span className="admin-highlight">{admin?.name}</span> 🛡️</h1>
            <p className="admin-subtitle">Here's your dashboard overview</p>

            {loading ? (
              <div className="spinner"></div>
            ) : (
              <div className="stats-grid" id="admin-stats">
                {statCards.map((card, i) => (
                  <motion.div
                    key={i}
                    className="stat-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="stat-card-icon" style={{ background: `${card.color}15`, color: card.color }}>
                      {card.icon}
                    </div>
                    <div className="stat-card-info">
                      <span className="stat-card-value">{card.value}</span>
                      <span className="stat-card-label">{card.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
