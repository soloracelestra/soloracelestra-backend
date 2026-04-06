const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');
const auth = require('../middleware/auth');

// Public: Get all themes
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    const themes = await Theme.find(query).sort({ createdAt: -1 });
    res.json(themes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create theme
router.post('/', auth, async (req, res) => {
  try {
    const theme = new Theme(req.body);
    await theme.save();
    res.status(201).json(theme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update theme
router.put('/:id', auth, async (req, res) => {
  try {
    const theme = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(theme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete theme
router.delete('/:id', auth, async (req, res) => {
  try {
    await Theme.findByIdAndDelete(req.params.id);
    res.json({ message: 'Theme deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Seed default themes
router.post('/seed', auth, async (req, res) => {
  const defaultThemes = [
    { name: 'Ember Bistro', category: 'Restaurant', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format', price: '₹18,000', desc: 'Warm, elegant restaurant theme' },
    { name: 'Brew & Bloom', category: 'Café', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format', price: '₹15,000', desc: 'Cozy café with warm tones' },
    { name: 'Velvet Glow', category: 'Salon', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format', price: '₹16,000', desc: 'Luxurious salon & spa theme' },
    { name: 'Iron & Oak', category: 'Gym', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format', price: '₹17,000', desc: 'Bold gym & fitness studio theme' },
    { name: 'Shopfront Pro', category: 'Retail', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format', price: '₹14,000', desc: 'Clean e-commerce ready shop' },
    { name: 'Auberge', category: 'Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format', price: '₹22,000', desc: 'Elegant hotel & guesthouse theme' },
    { name: 'Sweet Crumbs', category: 'Bakery', image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&auto=format', price: '₹13,000', desc: 'Charming bakery & patisserie' },
    { name: 'Couture', category: 'Fashion', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format', price: '₹20,000', desc: 'High-fashion boutique theme' },
  ];
  try {
    await Theme.deleteMany({});
    const themes = await Theme.insertMany(defaultThemes);
    res.json({ message: 'Themes seeded', count: themes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
