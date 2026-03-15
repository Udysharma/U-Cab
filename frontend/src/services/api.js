import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request (check both user and admin)
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('ucab_user') || 'null');
  const admin = JSON.parse(localStorage.getItem('ucab_admin') || 'null');
  const token = admin?.token || user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Rides
export const bookRide = (data) => API.post('/rides/book', data);
export const getRide = (id) => API.get(`/rides/${id}`);
export const updateRide = (id, data) => API.put(`/rides/${id}`, data);
export const cancelRide = (id) => API.delete(`/rides/${id}`);
export const getRideHistory = (userId) => API.get(`/rides/history/${userId}`);
export const getNearbyDrivers = (lat, lng, cabType) =>
  API.get('/rides/nearby-drivers', { params: { lat, lng, cabType } });
export const getFareEstimate = (data) => API.post('/rides/fare-estimate', data);

// Users
export const getUserProfile = (id) => API.get(`/users/${id}`);
export const updateUserProfile = (id, data) => API.put(`/users/${id}`, data);
export const savePaymentMethod = (id, data) => API.post(`/users/${id}/payment`, data);
export const getPaymentMethods = (id) => API.get(`/users/${id}/payments`);

// Drivers
export const getDrivers = () => API.get('/drivers');
export const getDriver = (id) => API.get(`/drivers/${id}`);

// ===================== ADMIN =====================
export const adminRegister = (data) => API.post('/admin/register', data);
export const adminLogin = (data) => API.post('/admin/login', data);

// Admin – Users
export const adminGetUsers = () => API.get('/admin/users');
export const adminGetUser = (id) => API.get(`/admin/users/${id}`);
export const adminUpdateUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`);

// Admin – Bookings
export const adminGetBookings = () => API.get('/admin/bookings');

// Admin – Cabs
export const adminGetCabs = () => API.get('/admin/cabs');
export const adminGetCab = (id) => API.get(`/admin/cabs/${id}`);
export const adminAddCab = (data) => API.post('/admin/cabs', data);
export const adminUpdateCab = (id, data) => API.put(`/admin/cabs/${id}`, data);
export const adminDeleteCab = (id) => API.delete(`/admin/cabs/${id}`);

// Admin – Stats
export const adminGetStats = () => API.get('/admin/stats');

export default API;
