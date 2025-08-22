const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
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

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema); 