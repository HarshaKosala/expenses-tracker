const expenseRepository = require('../repositories/expenseRepository');
const settingsRepository = require('../repositories/settingsRepository');

class ExpenseService {
  // Create a new expense
  async createExpense(expenseData, userId) {
    try {
      const expense = await expenseRepository.create({ ...expenseData, user: userId });
      return expense;
    } catch (error) {
      throw error;
    }
  }

  // Get all expenses with filtering
  async getExpenses(filters = {}, userId) {
    try {
      return await expenseRepository.findAll({ ...filters, userId });
    } catch (error) {
      throw error;
    }
  }

  // Get expense by ID
  async getExpenseById(id, userId) {
    try {
      const expense = await expenseRepository.findById(id, userId);
      if (!expense) {
        throw new Error('Expense not found');
      }
      return expense;
    } catch (error) {
      throw error;
    }
  }

  // Update expense
  async updateExpense(id, updateData, userId) {
    try {
      const expense = await expenseRepository.update(id, updateData, userId);
      if (!expense) {
        throw new Error('Expense not found');
      }
      return expense;
    } catch (error) {
      throw error;
    }
  }

  // Delete expense
  async deleteExpense(id, userId) {
    try {
      const expense = await expenseRepository.delete(id, userId);
      if (!expense) {
        throw new Error('Expense not found');
      }
      return expense;
    } catch (error) {
      throw error;
    }
  }

  // Get expenses for current month
  async getCurrentMonthExpenses(userId) {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getExpensesByMonth(year, month, userId);
    } catch (error) {
      throw error;
    }
  }

  // Get total expenses for current month
  async getCurrentMonthTotal(userId) {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getTotalExpensesByMonth(year, month, userId);
    } catch (error) {
      throw error;
    }
  }

  // Get expenses by type for current month
  async getCurrentMonthExpensesByType(userId) {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getExpensesByTypeForMonth(year, month, userId);
    } catch (error) {
      throw error;
    }
  }

  // Get expense statistics
  async getStatistics(userId) {
    try {
      return await expenseRepository.getStatistics(userId);
    } catch (error) {
      throw error;
    }
  }

  // Check if monthly limit is exceeded
  async checkMonthlyLimit(userId) {
    try {
      const [monthlyTotal, monthlyLimit, alertThreshold] = await Promise.all([
        this.getCurrentMonthTotal(userId),
        settingsRepository.getMonthlyLimit(userId),
        settingsRepository.getAlertThreshold(userId)
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
  async getTopCategories(limit = 5, userId) {
    try {
      return await expenseRepository.getTopCategories(limit, userId);
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