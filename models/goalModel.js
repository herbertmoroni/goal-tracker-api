const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'check-circle'
  },
  positive: {
    type: Boolean,
    default: true
  },
  points: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Create compound index for user and order
goalSchema.index({ user: 1, order: 1 });

module.exports = mongoose.model('Goal', goalSchema);