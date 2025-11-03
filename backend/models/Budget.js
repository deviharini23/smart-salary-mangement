const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a budget amount'],
    min: 0
  },
  month: {
    type: String,
    required: true // Format: "2024-01"
  },
  spent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one budget per category per month per user
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);