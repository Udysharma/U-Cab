import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Anav from './Anav';
import { adminGetCab, adminUpdateCab } from '../../services/api';
import './Ahome.css';

export default function Acabedit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ model: '', plateNumber: '', category: 'Economy', seats: 4, color: 'White', isActive: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchCab(); }, [id]);

  const fetchCab = async () => {
    try {
      const res = await adminGetCab(id);
      setFormData({
        model: res.data.model,
        plateNumber: res.data.plateNumber,
        category: res.data.category,
        seats: res.data.seats,
        color: res.data.color || 'White',
        isActive: res.data.isActive,
      });
    } catch (err) {
      console.error('Fetch cab error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateCab(id, formData);
      setMessage('Cab updated successfully!');
      setTimeout(() => navigate('/admin/cabs'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div><Anav /><div className="admin-page page-wrapper"><div className="spinner"></div></div></div>;

  return (
    <div>
      <Anav />
      <div className="admin-page page-wrapper">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Edit Cab</h1>

            {message && <div className="auth-error" style={{ background: message.includes('success') ? 'rgba(34,197,94,0.1)' : undefined, color: message.includes('success') ? 'var(--success)' : undefined, borderColor: message.includes('success') ? 'rgba(34,197,94,0.2)' : undefined, marginBottom: 16 }}>{message}</div>}

            <form className="admin-form glass-card" onSubmit={handleSubmit} id="edit-cab-form" style={{ padding: 28 }}>
              <div className="form-group">
                <label>Model</label>
                <input type="text" className="form-input" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Plate Number</label>
                <input type="text" className="form-input" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="Economy">Economy</option>
                  <option value="Premium">Premium</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <div className="form-group">
                <label>Seats</label>
                <input type="number" className="form-input" min="1" max="10" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input type="text" className="form-input" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                  Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-admin" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/cabs')}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
