const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monthlyExpenseLimit: {
    type: Number,
    required: true,
    default: process.env.DEFAULT_MONTHLY_LIMIT || 10000,
    min: [0, 'Monthly limit cannot be negative'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Monthly limit must be greater than 0'
    }
  },
  currency: {
    type: String,
    default: 'LKR',
    enum: ['LKR', 'USD', 'EUR', 'GBP']
  },
  alertThreshold: {
    type: Number,
    default: 90,
    min: [0, 'Alert threshold cannot be negative'],
    max: [100, 'Alert threshold cannot exceed 100%']
  }
}, {
  timestamps: true
});

// Get or create user settings
settingsSchema.statics.getSettings = async function(userId) {
  let settings = await this.findOne({ user: userId });
  if (!settings) {
    settings = await this.create({ user: userId });
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema); 