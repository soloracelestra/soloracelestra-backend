const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Admin: Stats — MUST be before /:id route
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const newCount = await Booking.countDocuments({ status: 'new' });
    const contacted = await Booking.countDocuments({ status: 'contacted' });
    const inProgress = await Booking.countDocuments({ status: 'progress' });
    const done = await Booking.countDocuments({ status: 'done' });

    const monthly = await Booking.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({ total, newCount, contacted, inProgress, done, monthly });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: Submit booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking submitted successfully', booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get all bookings
router.get('/', auth, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { business: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update booking status
router.patch('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
