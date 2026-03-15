import { FiCreditCard, FiTrash2 } from 'react-icons/fi';
import './PaymentCard.css';

export default function PaymentCard({ payment, onDelete }) {
  const masked = payment.cardNumber
    ? '•••• ' + payment.cardNumber.slice(-4)
    : '•••• ••••';

  const typeColors = {
    visa: '#1a1f71',
    mastercard: '#eb001b',
    upi: '#5f259f',
  };

  return (
    <div className="payment-card glass-card" id={`payment-card-${payment._id || 'new'}`}>
      <div className="payment-card-top">
        <div className="payment-card-chip"></div>
        <span
          className="payment-card-type"
          style={{ color: typeColors[payment.type] || '#fff' }}
        >
          {payment.type?.toUpperCase()}
        </span>
      </div>
      <div className="payment-card-number">{masked}</div>
      <div className="payment-card-bottom">
        <div>
          <label>Card Holder</label>
          <p>{payment.cardHolder}</p>
        </div>
        <div>
          <label>Expires</label>
          <p>{payment.expiryDate}</p>
        </div>
        {onDelete && (
          <button className="payment-delete" onClick={onDelete}>
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
}
