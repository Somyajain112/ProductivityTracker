const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['sleep', 'study', 'exercise', 'custom'],
      default: 'custom',
    },
    color: {
      type: String,
      default: '#4F46E5', // default indigo color
    },
    icon: {
      type: String,
      default: 'default',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
