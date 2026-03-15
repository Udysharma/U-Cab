import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import { adminLogin as apiAdminLogin, adminRegister } from '../../services/api';
import { FiMail, FiLock, FiUser, FiShield } from 'react-icons/fi';
import './Alogin.css';

export default function Alogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = isLogin
        ? await apiAdminLogin({ email: formData.email, password: formData.password })
        : await adminRegister(formData);
      adminLogin(res.data);
      navigate('/admin/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <motion.div
        className="admin-auth-container glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="admin-auth-header">
          <div className="admin-shield"><FiShield /></div>
          <h2>{isLogin ? 'Admin Login' : 'Admin Register'}</h2>
          <p>{isLogin ? 'Sign in to admin panel' : 'Create admin account'}</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${isLogin ? 'active admin-tab-active' : ''}`} onClick={() => setIsLogin(true)} id="admin-login-tab">Login</button>
          <button className={`auth-tab ${!isLogin ? 'active admin-tab-active' : ''}`} onClick={() => setIsLogin(false)} id="admin-register-tab">Register</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} id="admin-auth-form">
          {!isLogin && (
            <div className="form-group">
              <label><FiUser /> Name</label>
              <input type="text" name="name" className="form-input" placeholder="Admin name" value={formData.name} onChange={handleChange} required={!isLogin} id="admin-name" />
            </div>
          )}
          <div className="form-group">
            <label><FiMail /> Email</label>
            <input type="email" name="email" className="form-input" placeholder="admin@ucab.com" value={formData.email} onChange={handleChange} required id="admin-email" />
          </div>
          <div className="form-group">
            <label><FiLock /> Password</label>
            <input type="password" name="password" className="form-input" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} required minLength={6} id="admin-password" />
          </div>
          <button type="submit" className="btn btn-admin btn-lg" style={{ width: '100%' }} disabled={loading} id="admin-submit">
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="admin-auth-footer">
          <Link to="/auth">← Back to User Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
