const express = require('express');
const Expense = require('../models/Expense');

const router = express.Router();

// Get all expenses for user
router.get('/', async (req, res) => {
  try {
    // For now, return mock data - you'll add user authentication later
    const expenses = await Expense.find().sort({ date: -1 });
    
    res.json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    const { amount, description, category, type, paymentMethod } = req.body;

    const expense = await Expense.create({
      amount,
      description,
      category,
      type: type || 'expense',
      paymentMethod: paymentMethod || 'Card',
      // user: req.user.id // You'll add this when you implement auth
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get expense summary
router.get('/summary', async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;