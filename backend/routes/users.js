const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/:id – Fetch user profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/users/:id – Update user profile
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/users/:id/payment – Save payment method
router.post('/:id/payment', protect, async (req, res) => {
  try {
    const { cardNumber, cardHolder, expiryDate, type } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedPayments.push({ cardNumber, cardHolder, expiryDate, type });
    await user.save();
    res.json(user.savedPayments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/users/:id/payments – Get saved payment methods
router.get('/:id/payments', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedPayments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
