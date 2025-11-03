const express = require('express');
const Budget = require('../models/Budget');

const router = express.Router();

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ month: -1 });
    
    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create or update budget
router.post('/', async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { category, month },
      { amount },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Budget saved successfully',
      data: budget
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;