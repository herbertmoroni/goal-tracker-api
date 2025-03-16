const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'streak'],
    required: true
  },
  value: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Create compound index for user, type, and date
statSchema.index({ user: 1, type: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Stat', statSchema);