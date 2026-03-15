import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiMap, FiClock, FiCreditCard, FiTag, FiHome } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Book', icon: <FiMap /> },
    { path: '/history', label: 'History', icon: <FiClock /> },
    { path: '/payment', label: 'Payments', icon: <FiCreditCard /> },
    { path: '/discounts', label: 'Offers', icon: <FiTag /> },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
          <span className="brand-icon">🚕</span>
          <span className="brand-text">U Cab</span>
        </Link>

        {user ? (
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="navbar-user">
              <div className="user-avatar" id="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button className="btn-logout" onClick={handleLogout} id="logout-btn">
                <FiLogOut />
              </button>
            </div>
          </div>
        ) : (
          <Link to="/auth" className="btn btn-primary btn-sm" id="login-btn">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}
