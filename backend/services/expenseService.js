const expenseRepository = require('../repositories/expenseRepository');
const settingsRepository = require('../repositories/settingsRepository');

class ExpenseService {
  // Create a new expense
  async createExpense(expenseData) {
    try {
      const expense = await expenseRepository.create(expenseData);
      return expense;
    } catch (error) {
      throw error;
    }
  }

  // Get all expenses with filtering
  async getExpenses(filters = {}) {
    try {
      return await expenseRepository.findAll(filters);
    } catch (error) {
      throw error;
    }
  }

  // Get expense by ID
  async getExpenseById(id) {
    try {
      const expense = await expenseRepository.findById(id);
      if (!expense) {
        throw new Error('Expense not found');
      }
      return expense;
    } catch (error) {
      throw error;
    }
  }

  // Update expense
  async updateExpense(id, updateData) {
    try {
      const expense = await expenseRepository.update(id, updateData);
      if (!expense) {
        throw new Error('Expense not found');
      }
      return expense;
    } catch (error) {
      throw error;
    }
  }

  // Delete expense
  async deleteExpense(id) {
    try {
      const expense = await expenseRepository.delete(id);
      if (!expense) {
        throw new Error('Expense not found');
      }
      return expense;
    } catch (error) {
      throw error;
    }
  }

  // Get expenses for current month
  async getCurrentMonthExpenses() {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getExpensesByMonth(year, month);
    } catch (error) {
      throw error;
    }
  }

  // Get total expenses for current month
  async getCurrentMonthTotal() {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getTotalExpensesByMonth(year, month);
    } catch (error) {
      throw error;
    }
  }

  // Get expenses by type for current month
  async getCurrentMonthExpensesByType() {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getExpensesByTypeForMonth(year, month);
    } catch (error) {
      throw error;
    }
  }

  // Get expense statistics
  async getStatistics() {
    try {
      return await expenseRepository.getStatistics();
    } catch (error) {
      throw error;
    }
  }

  // Check if monthly limit is exceeded
  async checkMonthlyLimit() {
    try {
      const [monthlyTotal, monthlyLimit, alertThreshold] = await Promise.all([
        this.getCurrentMonthTotal(),
        settingsRepository.getMonthlyLimit(),
        settingsRepository.getAlertThreshold()
      ]);

      const percentageUsed = (monthlyTotal / monthlyLimit) * 100;
      const isAlertThresholdReached = percentageUsed >= alertThreshold;
      const isLimitExceeded = monthlyTotal >= monthlyLimit;

      return {
        monthlyTotal,
        monthlyLimit,
        percentageUsed: Math.round(percentageUsed * 100) / 100,
        isAlertThresholdReached,
        isLimitExceeded,
        remaining: monthlyLimit - monthlyTotal
      };
    } catch (error) {
      throw error;
    }
  }

  // Get top expense categories
  async getTopCategories(limit = 5) {
    try {
      return await expenseRepository.getTopCategories(limit);
    } catch (error) {
      throw error;
    }
  }

  // Validate expense data
  validateExpenseData(expenseData) {
    const errors = [];

    if (!expenseData.description || expenseData.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!expenseData.amount || expenseData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!expenseData.type) {
      errors.push('Expense type is required');
    }

    if (!expenseData.date) {
      errors.push('Date is required');
    }

    if (expenseData.date && new Date(expenseData.date) > new Date()) {
      errors.push('Date cannot be in the future');
    }

    return errors;
  }
}

module.exports = new ExpenseService(); 