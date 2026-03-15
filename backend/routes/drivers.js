const express = require('express');
const Driver = require('../models/Driver');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/drivers – List all drivers
router.get('/', protect, async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/drivers/:id – Get driver details
router.get('/:id', protect, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/drivers/:id/location – Update driver location
router.put('/:id/location', protect, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
      { new: true }
    );
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
