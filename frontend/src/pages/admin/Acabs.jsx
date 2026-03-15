import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Anav from './Anav';
import { adminGetCabs, adminDeleteCab } from '../../services/api';
import './Ahome.css';

export default function Acabs() {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchCabs(); }, []);

  const fetchCabs = async () => {
    try {
      const res = await adminGetCabs();
      setCabs(res.data);
    } catch (err) {
      console.error('Fetch cabs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cab?')) return;
    try {
      await adminDeleteCab(id);
      setCabs(cabs.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div>
      <Anav />
      <div className="admin-page page-wrapper">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="admin-page-header">
              <h1>Manage Cabs</h1>
              <button className="btn btn-admin btn-sm" onClick={() => navigate('/admin/addcar')} id="add-cab-btn">
                <FiPlus /> Add New Cab
              </button>
            </div>

            {loading ? <div className="spinner"></div> : cabs.length === 0 ? (
              <div className="empty-state">
                <h3>No cabs yet</h3>
                <p>Add your first cab to get started</p>
              </div>
            ) : (
              <div className="admin-table-wrapper glass-card" style={{ padding: 0 }}>
                <table className="admin-table" id="cabs-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Plate Number</th>
                      <th>Category</th>
                      <th>Seats</th>
                      <th>Color</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cabs.map((cab) => (
                      <tr key={cab._id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cab.model}</td>
                        <td>{cab.plateNumber}</td>
                        <td><span className="badge badge-accepted">{cab.category}</span></td>
                        <td>{cab.seats}</td>
                        <td>{cab.color}</td>
                        <td>
                          <span className={`badge ${cab.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                            {cab.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="actions">
                          <button className="btn-edit" onClick={() => navigate(`/admin/cabs/${cab._id}/edit`)}><FiEdit /> Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(cab._id)}><FiTrash2 /> Delete</button>
                        </td>
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
