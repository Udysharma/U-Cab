import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import PaymentCard from '../components/PaymentCard';
import { getPaymentMethods, savePaymentMethod } from '../services/api';
import './PaymentPage.css';

export default function PaymentPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    cardNumber: '', cardHolder: '', expiryDate: '', type: 'visa',
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getPaymentMethods(user._id);
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await savePaymentMethod(user._id, formData);
      setPayments(res.data);
      setShowForm(false);
      setFormData({ cardNumber: '', cardHolder: '', expiryDate: '', type: 'visa' });
    } catch (err) {
      console.error('Save payment error:', err);
    }
  };

  return (
    <div className="payment-page page-wrapper">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="page-header">
            <h1>Payment Methods</h1>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)} id="add-payment-btn">
              <FiPlus /> Add Card
            </button>
          </div>

          {showForm && (
            <motion.form
              className="add-payment-form glass-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSubmit}
              id="add-payment-form"
            >
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Card Number</label>
                  <input type="text" className="form-input" placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    required id="input-card-number" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Type</label>
                  <select className="form-input" value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Card Holder</label>
                  <input type="text" className="form-input" placeholder="Name on card"
                    value={formData.cardHolder}
                    onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                    required id="input-card-holder" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Expiry</label>
                  <input type="text" className="form-input" placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required id="input-card-expiry" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" id="save-payment-btn">Save Card</button>
            </motion.form>
          )}

          {loading ? (
            <div className="spinner"></div>
          ) : payments.length === 0 ? (
            <div className="empty-state">
              <h3>No saved payment methods</h3>
              <p>Add a card to get started</p>
            </div>
          ) : (
            <div className="payments-grid">
              {payments.map((p, i) => (
                <motion.div key={p._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <PaymentCard payment={p} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
