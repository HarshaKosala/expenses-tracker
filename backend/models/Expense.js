const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [100, 'Description cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Amount must be greater than 0'
    }
  },
  type: {
    type: String,
    required: [true, 'Expense type is required'],
    enum: {
      values: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'],
      message: 'Please select a valid expense type'
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Performance indexes
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, type: 1 });
expenseSchema.index({ user: 1, date: -1, type: 1 });

// Format helpers
expenseSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

expenseSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR'
  }).format(this.amount);
});

module.exports = mongoose.model('Expense', expenseSchema); 