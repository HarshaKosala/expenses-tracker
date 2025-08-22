const express = require('express');
const { body } = require('express-validator');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

// Validation middleware
const validateSettings = [
  body('monthlyExpenseLimit')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Monthly expense limit must be a positive number'),
  body('alertThreshold')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Alert threshold must be between 0 and 100'),
  body('currency')
    .optional()
    .isIn(['LKR', 'USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency selected')
];

const validateMonthlyLimit = [
  body('monthlyExpenseLimit')
    .isFloat({ min: 0.01 })
    .withMessage('Monthly expense limit must be a positive number')
];

const validateAlertThreshold = [
  body('alertThreshold')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Alert threshold must be between 0 and 100')
];

// Routes
// GET /api/settings - Get all settings
router.get('/', settingsController.getSettings);

// PUT /api/settings - Update settings
router.put('/', validateSettings, settingsController.updateSettings);

// GET /api/settings/monthly-limit - Get monthly expense limit
router.get('/monthly-limit', settingsController.getMonthlyLimit);

// PUT /api/settings/monthly-limit - Update monthly expense limit
router.put('/monthly-limit', validateMonthlyLimit, settingsController.updateMonthlyLimit);

// GET /api/settings/alert-threshold - Get alert threshold
router.get('/alert-threshold', settingsController.getAlertThreshold);

// PUT /api/settings/alert-threshold - Update alert threshold
router.put('/alert-threshold', validateAlertThreshold, settingsController.updateAlertThreshold);

module.exports = router; 