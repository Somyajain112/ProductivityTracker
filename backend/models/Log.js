const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
