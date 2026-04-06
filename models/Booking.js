const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  business: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: String,
  type: { type: String, required: true },
  themeId: String,
  themeName: String,
  budget: String,
  message: String,
  status: {
    type: String,
    enum: ['new', 'contacted', 'progress', 'done'],
    default: 'new'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
