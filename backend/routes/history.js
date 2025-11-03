const express = require('express');
const History = require('../models/History');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get all history
router.get('/', protect, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id });
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Complete month
router.post('/complete-month', protect, async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budget = await Budget.findOne({ userId: req.user._id, month: currentMonth });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'No active budget found'
      });
    }

    const expenses = await Expense.find({ userId: req.user._id, budgetId: budget._id });
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const actualSavings = budget.totalBudget - totalExpenses;

    const history = await History.create({
      userId: req.user._id,
      month: currentMonth,
      budget: budget.totalBudget,
      desiredSavings: budget.desiredSavings,
      totalExpenses,
      actualSavings,
      expenses: expenses.map(expense => ({
        name: expense.name,
        amount: expense.amount,
        category: expense.category
      }))
    });

    budget.isActive = false;
    await budget.save();

    res.status(201).json({
      success: true,
      message: 'Month completed successfully',
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;