import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Anav from './Anav';
import { adminGetUser, adminUpdateUser } from '../../services/api';
import './Ahome.css';

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchUser(); }, [id]);

  const fetchUser = async () => {
    try {
      const res = await adminGetUser(id);
      setFormData({ name: res.data.name, email: res.data.email, phone: res.data.phone || '' });
    } catch (err) {
      console.error('Fetch user error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateUser(id, formData);
      setMessage('User updated successfully!');
      setTimeout(() => navigate('/admin/users'), 1500);
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Edit User</h1>

            {message && <div className="auth-error" style={{ background: message.includes('success') ? 'rgba(34,197,94,0.1)' : undefined, color: message.includes('success') ? 'var(--success)' : undefined, borderColor: message.includes('success') ? 'rgba(34,197,94,0.2)' : undefined, marginBottom: 16 }}>{message}</div>}

            <form className="admin-form glass-card" onSubmit={handleSubmit} id="edit-user-form" style={{ padding: 28 }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-admin" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
