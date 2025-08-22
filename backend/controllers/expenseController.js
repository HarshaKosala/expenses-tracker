const expenseService = require('../services/expenseService');
const { validationResult } = require('express-validator');

class ExpenseController {
  // Create a new expense
  async createExpense(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const expenseData = req.body;
      
      // Additional validation
      const validationErrors = expenseService.validateExpenseData(expenseData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      const expense = await expenseService.createExpense(expenseData);
      
      res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: expense
      });
    } catch (error) {
      console.error('Create expense error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create expense',
        error: error.message
      });
    }
  }

  // Get all expenses with optional filtering
  async getExpenses(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        type: req.query.type,
        description: req.query.description,
        limit: req.query.limit,
        skip: req.query.skip
      };

      const expenses = await expenseService.getExpenses(filters);
      
      res.json({
        success: true,
        message: 'Expenses retrieved successfully',
        data: expenses,
        count: expenses.length
      });
    } catch (error) {
      console.error('Get expenses error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve expenses',
        error: error.message
      });
    }
  }

  // Get expense by ID
  async getExpenseById(req, res) {
    try {
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(id);
      
      res.json({
        success: true,
        message: 'Expense retrieved successfully',
        data: expense
      });
    } catch (error) {
      console.error('Get expense by ID error:', error);
      if (error.message === 'Expense not found') {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve expense',
        error: error.message
      });
    }
  }

  // Update expense
  async updateExpense(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      const expense = await expenseService.updateExpense(id, updateData);
      
      res.json({
        success: true,
        message: 'Expense updated successfully',
        data: expense
      });
    } catch (error) {
      console.error('Update expense error:', error);
      if (error.message === 'Expense not found') {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update expense',
        error: error.message
      });
    }
  }

  // Delete expense
  async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      const expense = await expenseService.deleteExpense(id);
      
      res.json({
        success: true,
        message: 'Expense deleted successfully',
        data: expense
      });
    } catch (error) {
      console.error('Delete expense error:', error);
      if (error.message === 'Expense not found') {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete expense',
        error: error.message
      });
    }
  }

  // Get current month expenses
  async getCurrentMonthExpenses(req, res) {
    try {
      const expenses = await expenseService.getCurrentMonthExpenses();
      
      res.json({
        success: true,
        message: 'Current month expenses retrieved successfully',
        data: expenses,
        count: expenses.length
      });
    } catch (error) {
      console.error('Get current month expenses error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve current month expenses',
        error: error.message
      });
    }
  }

  // Get expense statistics
  async getStatistics(req, res) {
    try {
      const statistics = await expenseService.getStatistics();
      
      res.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve statistics',
        error: error.message
      });
    }
  }

  // Check monthly limit
  async checkMonthlyLimit(req, res) {
    try {
      const limitInfo = await expenseService.checkMonthlyLimit();
      
      res.json({
        success: true,
        message: 'Monthly limit check completed',
        data: limitInfo
      });
    } catch (error) {
      console.error('Check monthly limit error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check monthly limit',
        error: error.message
      });
    }
  }

  // Get expenses by type for current month
  async getCurrentMonthExpensesByType(req, res) {
    try {
      const expensesByType = await expenseService.getCurrentMonthExpensesByType();
      
      res.json({
        success: true,
        message: 'Current month expenses by type retrieved successfully',
        data: expensesByType
      });
    } catch (error) {
      console.error('Get current month expenses by type error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve current month expenses by type',
        error: error.message
      });
    }
  }

  // Get top categories
  async getTopCategories(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const topCategories = await expenseService.getTopCategories(limit);
      
      res.json({
        success: true,
        message: 'Top categories retrieved successfully',
        data: topCategories
      });
    } catch (error) {
      console.error('Get top categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve top categories',
        error: error.message
      });
    }
  }
}

module.exports = new ExpenseController(); 