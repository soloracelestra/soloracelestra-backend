const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  business: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, required: true },
  avatar: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
