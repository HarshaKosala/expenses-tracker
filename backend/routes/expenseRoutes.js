const express = require('express');
const { body, param, query } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateExpense = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 100 })
    .withMessage('Description cannot exceed 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'])
    .withMessage('Please select a valid expense type'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    })
];

const validateExpenseId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID')
];

const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (req.query.startDate && new Date(value) < new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

// Routes
// POST /api/expenses - Create a new expense
router.post('/', auth, validateExpense, expenseController.createExpense);

// GET /api/expenses - Get all expenses with optional filtering
router.get('/', auth, validateDateRange, expenseController.getExpenses);

// GET /api/expenses/current-month - Get current month expenses
router.get('/current-month', auth, expenseController.getCurrentMonthExpenses);

// GET /api/expenses/statistics - Get expense statistics
router.get('/statistics', auth, expenseController.getStatistics);

// GET /api/expenses/monthly-limit - Check monthly limit
router.get('/monthly-limit', auth, expenseController.checkMonthlyLimit);

// GET /api/expenses/by-type - Get expenses by type for current month
router.get('/by-type', auth, expenseController.getCurrentMonthExpensesByType);

// GET /api/expenses/top-categories - Get top expense categories
router.get('/top-categories', auth, expenseController.getTopCategories);

// GET /api/expenses/:id - Get expense by ID
router.get('/:id', auth, validateExpenseId, expenseController.getExpenseById);

// PUT /api/expenses/:id - Update expense
router.put('/:id', auth, validateExpenseId, validateExpense, expenseController.updateExpense);

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', auth, validateExpenseId, expenseController.deleteExpense);

module.exports = router; 