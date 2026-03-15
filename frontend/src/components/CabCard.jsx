import { FiUsers, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './CabCard.css';

const cabInfo = {
  Economy: { icon: '🚗', seats: '4', desc: 'Affordable everyday rides' },
  Premium: { icon: '🚘', seats: '4', desc: 'Comfortable premium sedans' },
  XL: { icon: '🚐', seats: '6', desc: 'Spacious rides for groups' },
};

export default function CabCard({ type, rate, selected, onClick }) {
  const info = cabInfo[type] || cabInfo.Economy;

  return (
    <motion.div
      className={`cab-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      id={`cab-card-${type.toLowerCase()}`}
    >
      <div className="cab-card-icon">{info.icon}</div>
      <div className="cab-card-info">
        <h3>{type}</h3>
        <p>{info.desc}</p>
        <div className="cab-card-meta">
          <span><FiUsers /> {info.seats}</span>
          <span>₹{rate}/km</span>
        </div>
      </div>
      {selected && <div className="cab-card-check">✓</div>}
    </motion.div>
  );
}
