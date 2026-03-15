import { FiStar, FiMapPin } from 'react-icons/fi';
import './NearbyCab.css';

export default function NearbyCab({ driver }) {
  return (
    <div className="nearby-cab glass-card" id={`nearby-driver-${driver._id}`}>
      <div className="nearby-cab-avatar">
        {driver.name?.charAt(0)}
      </div>
      <div className="nearby-cab-info">
        <h4>{driver.name}</h4>
        <p className="nearby-cab-vehicle">{driver.vehicleModel} · {driver.vehicleNumber}</p>
        <div className="nearby-cab-meta">
          <span className="nearby-cab-rating">
            <FiStar /> {driver.rating}
          </span>
          <span className="nearby-cab-type">{driver.cabType}</span>
        </div>
      </div>
      <div className="nearby-cab-status">
        <span className={`status-dot ${driver.isAvailable ? 'available' : 'busy'}`}></span>
        {driver.isAvailable ? 'Available' : 'Busy'}
      </div>
    </div>
  );
}
