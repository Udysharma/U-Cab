import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTruck } from 'react-icons/fi';
import Anav from './Anav';
import { adminAddCab } from '../../services/api';
import './Ahome.css';

export default function Addcar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    model: '', plateNumber: '', category: 'Economy', seats: 4, color: 'White',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await adminAddCab(formData);
      setMessage('Cab added successfully!');
      setTimeout(() => navigate('/admin/cabs'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add cab');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Anav />
      <div className="admin-page page-wrapper">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiTruck /> Add New Cab
            </h1>

            {message && <div className="auth-error" style={{ background: message.includes('success') ? 'rgba(34,197,94,0.1)' : undefined, color: message.includes('success') ? 'var(--success)' : undefined, borderColor: message.includes('success') ? 'rgba(34,197,94,0.2)' : undefined, marginBottom: 16 }}>{message}</div>}

            <form className="admin-form glass-card" onSubmit={handleSubmit} id="add-car-form" style={{ padding: 28 }}>
              <div className="form-group">
                <label>Vehicle Model</label>
                <input type="text" className="form-input" placeholder="e.g. Maruti Swift" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required id="input-model" />
              </div>
              <div className="form-group">
                <label>Plate Number</label>
                <input type="text" className="form-input" placeholder="e.g. DL-01-AB-1234" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} required id="input-plate" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} id="input-category">
                  <option value="Economy">Economy</option>
                  <option value="Premium">Premium</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Seats</label>
                <input type="number" className="form-input" min="1" max="10" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })} required id="input-seats" />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input type="text" className="form-input" placeholder="e.g. White" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} id="input-color" />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-admin btn-lg" disabled={loading} id="submit-add-car">
                  {loading ? 'Adding...' : 'Add Cab'}
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/admin/cabs')}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
