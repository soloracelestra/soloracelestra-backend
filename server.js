const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS — allow everything
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/themes', require('./routes/themes'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check — also shows env var status for debugging
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Solora Celestra API running',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    hasMongoUri: !!process.env.MONGODB_URI,
    hasAdminUser: !!process.env.ADMIN_USERNAME,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV
  });
});

// MongoDB — with retry and better error logging
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectMongo, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected — attempting reconnect...');
  setTimeout(connectMongo, 3000);
});

connectMongo();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 MONGODB_URI set: ${!!process.env.MONGODB_URI}`);
  console.log(`🔐 ADMIN_USERNAME set: ${!!process.env.ADMIN_USERNAME}`);
  console.log(`🔑 JWT_SECRET set: ${!!process.env.JWT_SECRET}`);
});
