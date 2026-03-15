import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './RideTimer.css';

export default function RideTimer({ eta }) {
  const [timeLeft, setTimeLeft] = useState(eta * 60); // convert minutes to seconds

  useEffect(() => {
    setTimeLeft(eta * 60);
  }, [eta]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = eta > 0 ? ((eta * 60 - timeLeft) / (eta * 60)) * 100 : 0;

  return (
    <div className="ride-timer" id="ride-timer">
      <div className="timer-circle">
        <svg viewBox="0 0 120 120" className="timer-svg">
          <circle className="timer-track" cx="60" cy="60" r="52" />
          <motion.circle
            className="timer-progress"
            cx="60" cy="60" r="52"
            strokeDasharray={327}
            strokeDashoffset={327 - (327 * progress) / 100}
            initial={{ strokeDashoffset: 327 }}
            animate={{ strokeDashoffset: 327 - (327 * progress) / 100 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="timer-display">
          <span className="timer-value">{minutes}</span>
          <span className="timer-unit">min</span>
          <span className="timer-seconds">{String(seconds).padStart(2, '0')}s</span>
        </div>
      </div>
      <p className="timer-label">Estimated Arrival</p>
    </div>
  );
}
