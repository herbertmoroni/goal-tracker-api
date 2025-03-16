const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Create compound index for user, goal, and date for faster queries
checkSchema.index({ user: 1, goal: 1, date: 1 }, { unique: true });
// Create index for date queries
checkSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Check', checkSchema);