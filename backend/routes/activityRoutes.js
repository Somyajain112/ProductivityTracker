const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/activities
// @desc    Get all activities for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/activities
// @desc    Create a new activity
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, category, color, icon } = req.body;

  try {
    const activity = await Activity.create({
      user: req.user._id,
      name,
      category: category || 'custom',
      color,
      icon,
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update an activity
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete an activity
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
