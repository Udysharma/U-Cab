import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Anav from './Anav';
import { adminGetUsers, adminDeleteUser } from '../../services/api';
import './Ahome.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminGetUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminDeleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
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
              <h1>Manage Users</h1>
              <span className="badge badge-accepted">{users.length} users</span>
            </div>

            {loading ? <div className="spinner"></div> : (
              <div className="admin-table-wrapper glass-card" style={{ padding: 0 }}>
                <table className="admin-table" id="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || '—'}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="actions">
                          <button className="btn-edit" onClick={() => navigate(`/admin/users/${user._id}/edit`)}><FiEdit /> Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(user._id)}><FiTrash2 /> Delete</button>
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
