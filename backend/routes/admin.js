const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

// Generate JWT for admin
const generateToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Admin auth middleware
const adminProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as admin' });
      }
      req.admin = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ===================== AUTH =====================

// POST /api/admin/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, password });
    res.status(201).json({
      _id: admin._id, name: admin.name, email: admin.email,
      role: 'admin', token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: admin._id, name: admin.name, email: admin.email,
      role: 'admin', token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===================== USERS MANAGEMENT =====================

// GET /api/admin/users – Get all users
router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', adminProtect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/admin/users/:id – Edit user
router.put('/users/:id', adminProtect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, { name, email, phone }, { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/admin/users/:id – Delete user
router.delete('/users/:id', adminProtect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===================== BOOKINGS MANAGEMENT =====================

// GET /api/admin/bookings – All bookings
router.get('/bookings', adminProtect, async (req, res) => {
  try {
    const bookings = await Ride.find()
      .populate('userId', 'name email')
      .populate('driverId', 'name cabType vehicleNumber')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===================== CABS / VEHICLES MANAGEMENT =====================

// GET /api/admin/cabs – All vehicles
router.get('/cabs', adminProtect, async (req, res) => {
  try {
    const cabs = await Vehicle.find().populate('driverId', 'name').sort({ createdAt: -1 });
    res.json(cabs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/admin/cabs/:id
router.get('/cabs/:id', adminProtect, async (req, res) => {
  try {
    const cab = await Vehicle.findById(req.params.id);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    res.json(cab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/admin/cabs – Add new cab
router.post('/cabs', adminProtect, async (req, res) => {
  try {
    const { model, plateNumber, category, seats, color } = req.body;
    const cab = await Vehicle.create({ model, plateNumber, category, seats, color });
    res.status(201).json(cab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/admin/cabs/:id – Edit cab
router.put('/cabs/:id', adminProtect, async (req, res) => {
  try {
    const cab = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    res.json(cab);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/admin/cabs/:id – Delete cab
router.delete('/cabs/:id', adminProtect, async (req, res) => {
  try {
    const cab = await Vehicle.findByIdAndDelete(req.params.id);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    res.json({ message: 'Cab deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===================== REPORTS & ANALYTICS =====================

// GET /api/admin/stats – Dashboard stats
router.get('/stats', adminProtect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrivers = await Driver.countDocuments();
    const totalRides = await Ride.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const cancelledRides = await Ride.countDocuments({ status: 'cancelled' });
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      totalUsers,
      totalDrivers,
      totalRides,
      totalVehicles,
      completedRides,
      cancelledRides,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
