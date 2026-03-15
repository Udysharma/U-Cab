import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTag, FiCheck, FiGift } from 'react-icons/fi';
import './DiscountsPage.css';

const availableOffers = [
  { code: 'UCAB20', percentage: 20, maxDiscount: 100, description: 'Get 20% off on your next ride (max ₹100)' },
  { code: 'FIRST50', percentage: 50, maxDiscount: 200, description: '50% off for first-time riders (max ₹200)' },
  { code: 'RIDE10', percentage: 10, maxDiscount: 50, description: '10% off on all Economy rides (max ₹50)' },
];

export default function DiscountsPage() {
  const [inputCode, setInputCode] = useState('');
  const [result, setResult] = useState(null);

  const handleApply = (e) => {
    e.preventDefault();
    const found = availableOffers.find(
      (o) => o.code.toLowerCase() === inputCode.trim().toLowerCase()
    );

    if (found) {
      setResult({ success: true, message: `🎉 Code applied! ${found.percentage}% off (max ₹${found.maxDiscount})` });
    } else {
      setResult({ success: false, message: 'Invalid code. Please try again.' });
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setInputCode(code);
  };

  return (
    <div className="discounts-page page-wrapper">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title">Offers & Discounts</h1>

          {/* Apply Code */}
          <div className="coupon-input-section glass-card">
            <h2><FiTag /> Have a Coupon Code?</h2>
            <form className="coupon-form" onSubmit={handleApply} id="coupon-form">
              <input
                type="text"
                className="form-input"
                placeholder="Enter coupon code"
                value={inputCode}
                onChange={(e) => { setInputCode(e.target.value); setResult(null); }}
                id="coupon-input"
              />
              <button type="submit" className="btn btn-primary" id="apply-coupon-btn">
                Apply
              </button>
            </form>
            {result && (
              <motion.div
                className={`coupon-result ${result.success ? 'success' : 'error'}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="coupon-result"
              >
                {result.success ? <FiCheck /> : <FiTag />}
                {result.message}
              </motion.div>
            )}
          </div>

          {/* Available Offers */}
          <h2 className="section-heading"><FiGift /> Available Offers</h2>
          <div className="offers-grid">
            {availableOffers.map((offer, i) => (
              <motion.div
                key={offer.code}
                className="offer-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="offer-badge">{offer.percentage}% OFF</div>
                <p className="offer-desc">{offer.description}</p>
                <div className="offer-footer">
                  <code className="offer-code">{offer.code}</code>
                  <button className="btn btn-secondary btn-sm" onClick={() => copyCode(offer.code)}>
                    Copy & Apply
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
