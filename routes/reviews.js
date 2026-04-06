const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Public: Get approved reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: Submit a review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ message: 'Review submitted! It will appear after approval.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get all reviews
router.get('/all', auth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update review status
router.patch('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Seed reviews
router.post('/seed', auth, async (req, res) => {
  const defaultReviews = [
    { name: 'Ravi Mehta', business: "Mehta's Kitchen, Mumbai", rating: 5, text: 'Solora Celestra transformed our restaurant\'s online presence completely. Within 10 days we had a stunning website and our orders jumped 40%!', status: 'approved' },
    { name: 'Priya Nair', business: 'Bloom Café, Bangalore', rating: 5, text: 'The team is incredibly professional and talented. Our café website looks like it cost 5x more than we paid. Highly recommend!', status: 'approved' },
    { name: 'Arjun Singh', business: 'FitZone Gym, Delhi', rating: 5, text: 'Our new gym website has been a game-changer. Membership inquiries doubled in the first month after launch.', status: 'approved' },
    { name: 'Sneha Patel', business: 'Velvet Touch Salon, Ahmedabad', rating: 5, text: 'From concept to launch in just 12 days! The mobile experience is flawless. Our booking rate has tripled.', status: 'approved' },
  ];
  try {
    await Review.deleteMany({});
    const reviews = await Review.insertMany(defaultReviews);
    res.json({ message: 'Reviews seeded', count: reviews.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
