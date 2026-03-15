import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TrackingPage from './pages/TrackingPage';
import PaymentPage from './pages/PaymentPage';
import HistoryPage from './pages/HistoryPage';
import DiscountsPage from './pages/DiscountsPage';

// Admin pages
import Alogin from './pages/admin/Alogin';
import Ahome from './pages/admin/Ahome';
import Users from './pages/admin/Users';
import UserEdit from './pages/admin/UserEdit';
import Bookings from './pages/admin/Bookings';
import Acabs from './pages/admin/Acabs';
import Acabedit from './pages/admin/Acabedit';
import Addcar from './pages/admin/Addcar';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '200px' }}></div>;
  return user ? children : <Navigate to="/auth" />;
}

function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAdmin();
  if (loading) return <div className="spinner" style={{ marginTop: '200px' }}></div>;
  return admin ? children : <Navigate to="/admin/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <><Navbar /><LandingPage /></>} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <><Navbar /><AuthPage /></>} />
      <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
      <Route path="/tracking/:rideId" element={<ProtectedRoute><Navbar /><TrackingPage /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Navbar /><PaymentPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><Navbar /><HistoryPage /></ProtectedRoute>} />
      <Route path="/discounts" element={<ProtectedRoute><Navbar /><DiscountsPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Alogin />} />
      <Route path="/admin/home" element={<AdminProtectedRoute><Ahome /></AdminProtectedRoute>} />
      <Route path="/admin/users" element={<AdminProtectedRoute><Users /></AdminProtectedRoute>} />
      <Route path="/admin/users/:id/edit" element={<AdminProtectedRoute><UserEdit /></AdminProtectedRoute>} />
      <Route path="/admin/bookings" element={<AdminProtectedRoute><Bookings /></AdminProtectedRoute>} />
      <Route path="/admin/cabs" element={<AdminProtectedRoute><Acabs /></AdminProtectedRoute>} />
      <Route path="/admin/cabs/:id/edit" element={<AdminProtectedRoute><Acabedit /></AdminProtectedRoute>} />
      <Route path="/admin/addcar" element={<AdminProtectedRoute><Addcar /></AdminProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <BookingProvider>
            <AppRoutes />
          </BookingProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}
