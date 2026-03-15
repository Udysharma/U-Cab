import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiShield, FiClock, FiDollarSign, FiStar, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const features = [
  { icon: <FiMapPin />, title: 'Live Tracking', desc: 'Track your ride in real-time from pickup to destination' },
  { icon: <FiShield />, title: 'Safe & Secure', desc: 'Verified drivers and 24/7 customer support' },
  { icon: <FiClock />, title: 'Quick Pickups', desc: 'Average pickup time under 5 minutes' },
  { icon: <FiDollarSign />, title: 'Fair Pricing', desc: 'Transparent fares with no hidden charges' },
  { icon: <FiStar />, title: 'Top Rated', desc: 'Highly rated drivers for a premium experience' },
  { icon: <FiZap />, title: 'Instant Booking', desc: 'Book your ride in under 30 seconds' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Animated background */}
      <div className="landing-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      {/* Hero */}
      <section className="hero" id="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="hero-badge">🚕 Premium Rides Await</span>
          <h1 className="hero-title">
            Your Ride,<br />
            <span className="hero-gradient">Your Way.</span>
          </h1>
          <p className="hero-subtitle">
            Book premium cabs instantly. Real-time tracking, fair pricing,
            and top-rated drivers — all in one app.
          </p>
          <div className="hero-actions">
            <Link
              to={user ? '/dashboard' : '/auth'}
              className="btn btn-primary btn-lg"
              id="hero-cta"
            >
              {user ? 'Go to Dashboard' : 'Start Booking'}
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              Learn More
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Happy Riders</span>
            </div>
            <div className="stat">
              <span className="stat-value">500+</span>
              <span className="stat-label">Drivers</span>
            </div>
            <div className="stat">
              <span className="stat-value">4.8</span>
              <span className="stat-label">App Rating</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose <span className="hero-gradient">U Cab</span>?
          </motion.h2>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feature-card glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Ride?</h2>
            <p>Join thousands of happy riders. Your first ride is on us!</p>
            <Link to="/auth" className="btn btn-primary btn-lg">
              Sign Up Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 U Cab. All rights reserved.</p>
      </footer>
    </div>
  );
}
