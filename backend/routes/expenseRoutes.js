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

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [Food, Transport, Entertainment, Shopping, Bills, Healthcare, Education, Other]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Expense created
 */
router.post('/', auth, validateExpense, expenseController.createExpense);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter until date
 *     responses:
 *       200:
 *         description: List of expenses
 */
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

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense details
 *       404:
 *         description: Expense not found
 */
router.get('/:id', auth, validateExpenseId, expenseController.getExpenseById);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [Food, Transport, Entertainment, Shopping, Bills, Healthcare, Education, Other]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Expense updated
 *       404:
 *         description: Expense not found
 */
router.put('/:id', auth, validateExpenseId, validateExpense, expenseController.updateExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Remove expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense removed
 *       404:
 *         description: Expense not found
 */
router.delete('/:id', auth, validateExpenseId, expenseController.removeExpense);

module.exports = router; 