const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Debug log (remove after fixing)
    console.log('Login attempt:', { username, hasPassword: !!password });
    console.log('Expected:', {
      adminUser: process.env.ADMIN_USERNAME,
      hasAdminPass: !!process.env.ADMIN_PASSWORD,
      hasJwt: !!process.env.JWT_SECRET
    });

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      console.error('❌ ADMIN env vars not set!');
      return res.status(500).json({ message: 'Server configuration error. Please contact admin.' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not set!');
      return res.status(500).json({ message: 'Server configuration error. JWT not configured.' });
    }

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login: ' + err.message });
  }
});

module.exports = router;
