const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/logs
// @desc    Get all logs for logged in user (optionally filter by date range)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const logs = await Log.find(query)
      .populate('activity', 'name category color icon')
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/logs
// @desc    Create a new log entry
// @access  Private
router.post('/', protect, async (req, res) => {
  const { activity, date, durationMinutes, notes } = req.body;

  try {
    const log = await Log.create({
      user: req.user._id,
      activity,
      date,
      durationMinutes,
      notes,
    });

    const populated = await log.populate('activity', 'name category color icon');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/logs/:id
// @desc    Update a log entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) return res.status(404).json({ message: 'Log not found' });

    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Log.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('activity', 'name category color icon');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/logs/:id
// @desc    Delete a log entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) return res.status(404).json({ message: 'Log not found' });

    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await log.deleteOne();
    res.json({ message: 'Log removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
