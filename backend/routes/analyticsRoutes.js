const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/analytics/summary
// @desc    Get total time per activity for a date range
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = { user: req.user._id };
    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const summary = await Log.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$activity',
          totalMinutes: { $sum: '$durationMinutes' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'activities',
          localField: '_id',
          foreignField: '_id',
          as: 'activity',
        },
      },
      { $unwind: '$activity' },
      {
        $project: {
          activityName: '$activity.name',
          category: '$activity.category',
          color: '$activity.color',
          totalMinutes: 1,
          totalHours: { $round: [{ $divide: ['$totalMinutes', 60] }, 2] },
          count: 1,
        },
      },
      { $sort: { totalMinutes: -1 } },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/daily
// @desc    Get daily breakdown of activity time
// @access  Private
router.get('/daily', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = { user: req.user._id };
    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const daily = await Log.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            activity: '$activity',
          },
          totalMinutes: { $sum: '$durationMinutes' },
        },
      },
      {
        $lookup: {
          from: 'activities',
          localField: '_id.activity',
          foreignField: '_id',
          as: 'activity',
        },
      },
      { $unwind: '$activity' },
      {
        $project: {
          date: '$_id.date',
          activityName: '$activity.name',
          category: '$activity.category',
          color: '$activity.color',
          totalMinutes: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json(daily);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/insights
// @desc    Get productivity insights (averages, streaks, etc.)
// @access  Private
router.get('/insights', protect, async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const logs = await Log.find({
      user: req.user._id,
      date: { $gte: last7Days },
    }).populate('activity', 'name category');

    const totalMinutes = logs.reduce((sum, log) => sum + log.durationMinutes, 0);
    const avgDailyMinutes = Math.round(totalMinutes / 7);

    // Category breakdown
    const categoryMap = {};
    logs.forEach((log) => {
      const cat = log.activity.category;
      categoryMap[cat] = (categoryMap[cat] || 0) + log.durationMinutes;
    });

    res.json({
      last7DaysTotalMinutes: totalMinutes,
      last7DaysTotalHours: (totalMinutes / 60).toFixed(2),
      avgDailyMinutes,
      avgDailyHours: (avgDailyMinutes / 60).toFixed(2),
      categoryBreakdown: categoryMap,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
