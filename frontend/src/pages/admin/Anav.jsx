import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FiLogOut, FiHome, FiUsers, FiTruck, FiPlusCircle, FiClipboard } from 'react-icons/fi';
import './Anav.css';

export default function Anav() {
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const links = [
    { path: '/admin/home', label: 'Dashboard', icon: <FiHome /> },
    { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
    { path: '/admin/bookings', label: 'Bookings', icon: <FiClipboard /> },
    { path: '/admin/cabs', label: 'Cabs', icon: <FiTruck /> },
    { path: '/admin/addcar', label: 'Add Cab', icon: <FiPlusCircle /> },
  ];

  return (
    <nav className="admin-nav" id="admin-navbar">
      <div className="admin-nav-container">
        <Link to="/admin/home" className="admin-brand">
          <span>🛡️</span>
          <span className="admin-brand-text">U Cab Admin</span>
        </Link>

        <div className="admin-nav-links">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`admin-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="admin-nav-user">
          <span className="admin-avatar">{admin?.name?.charAt(0)?.toUpperCase()}</span>
          <button className="btn-logout" onClick={handleLogout} id="admin-logout-btn">
            <FiLogOut />
          </button>
        </div>
      </div>
    </nav>
  );
}
