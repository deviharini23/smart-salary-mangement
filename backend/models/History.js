const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      trim: true
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    desiredSavings: {
      type: Number,
      required: [true, 'Desired savings is required'],
      min: [0, 'Desired savings cannot be negative']
    },
    totalExpenses: {
      type: Number,
      required: [true, 'Total expenses are required'],
      min: [0, 'Expenses cannot be negative']
    },
    actualSavings: {
      type: Number,
      required: [true, 'Actual savings is required'],
      min: [0, 'Savings cannot be negative']
    },
    expenses: [
      {
        name: {
          type: String,
          trim: true
        },
        amount: {
          type: Number,
          min: [0, 'Expense amount cannot be negative']
        },
        category: {
          type: String,
          trim: true
        }
      }
    ],
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,        // Automatically adds createdAt & updatedAt
    collection: 'histories'  // Explicitly define collection name
  }
);

module.exports = mongoose.model('History', historySchema);
