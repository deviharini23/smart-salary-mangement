const express = require('express');
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get all goals
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    res.json({
      success: true,
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create goal
router.post('/', protect, async (req, res) => {
  try {
    const { name, targetAmount, monthlyContribution } = req.body;

    await Goal.updateMany(
      { userId: req.user._id, isActive: true },
      { isActive: false }
    );

    const goal = await Goal.create({
      userId: req.user._id,
      name,
      targetAmount,
      monthlyContribution: monthlyContribution || 0,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update goal progress
router.patch('/:id/progress', protect, async (req, res) => {
  try {
    const { contribution } = req.body;

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    goal.savedAmount += contribution;
    if (goal.savedAmount >= goal.targetAmount) {
      goal.isActive = false;
      goal.completedAt = new Date();
    }

    await goal.save();

    res.json({
      success: true,
      message: 'Goal progress updated',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;