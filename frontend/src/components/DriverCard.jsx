import { FiPhone, FiStar } from 'react-icons/fi';
import './DriverCard.css';

export default function DriverCard({ driver }) {
  if (!driver) return null;

  return (
    <div className="driver-card glass-card" id="assigned-driver-card">
      <div className="driver-card-header">
        <div className="driver-avatar">
          {driver.name?.charAt(0)}
        </div>
        <div className="driver-info">
          <h3>{driver.name}</h3>
          <div className="driver-rating">
            <FiStar /> {driver.rating}
          </div>
        </div>
        <a href={`tel:${driver.phone}`} className="driver-call">
          <FiPhone />
        </a>
      </div>
      <div className="driver-vehicle">
        <span className="vehicle-model">{driver.vehicleModel}</span>
        <span className="vehicle-number">{driver.vehicleNumber}</span>
        <span className="vehicle-type">{driver.cabType}</span>
      </div>
    </div>
  );
}
