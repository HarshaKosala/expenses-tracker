const expenseRepository = require('../repositories/expenseRepository');
const settingsRepository = require('../repositories/settingsRepository');

class ExpenseService {
  async createExpense(expenseData, userId) {
    try {
      const expense = await expenseRepository.createExpense({ ...expenseData, user: userId });
      console.log(`Expense created for user ${userId}: ${expense.description}`);
      return expense;
    } catch (error) {
      console.log('Error in createExpense service:', error.message);
      throw error;
    }
  }

  async getExpenses(filters = {}, userId) {
    try {
      return await expenseRepository.getExpenses({ ...filters, userId });
    } catch (error) {
      console.log('Error in getExpenses service:', error.message);
      throw error;
    }
  }

  async getExpenseById(id, userId) {
    try {
      const expense = await expenseRepository.getExpenseById(id, userId);
      if (!expense) {
        throw new Error('Expense not found');
      }
      return expense;
    } catch (error) {
      console.log('Error in getExpenseById service:', error.message);
      throw error;
    }
  }

  async updateExpense(id, updateData, userId) {
    try {
      const expense = await expenseRepository.updateExpense(id, updateData, userId);
      if (!expense) {
        throw new Error('Expense not found');
      }
      console.log(`Expense ${id} updated for user ${userId}`);
      return expense;
    } catch (error) {
      console.log('Error in updateExpense service:', error.message);
      throw error;
    }
  }

  async removeExpense(id, userId) {
    try {
      const expense = await expenseRepository.removeExpense(id, userId);
      if (!expense) {
        throw new Error('Expense not found');
      }
      console.log(`Expense ${id} removed for user ${userId}`);
      return expense;
    } catch (error) {
      console.log('Error in removeExpense service:', error.message);
      throw error;
    }
  }

  async getCurrentMonthExpenses(userId) {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getExpensesByMonth(year, month, userId);
    } catch (error) {
      console.log('Error in getCurrentMonthExpenses service:', error.message);
      throw error;
    }
  }

  async getCurrentMonthTotal(userId) {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getMonthlyTotal(year, month, userId);
    } catch (error) {
      console.log('Error in getCurrentMonthTotal service:', error.message);
      throw error;
    }
  }

  async getCurrentMonthExpensesByType(userId) {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      return await expenseRepository.getMonthlyExpensesByType(year, month, userId);
    } catch (error) {
      console.log('Error in getCurrentMonthExpensesByType service:', error.message);
      throw error;
    }
  }

  async getStatistics(userId) {
    try {
      return await expenseRepository.getExpenseStats(userId);
    } catch (error) {
      console.log('Error in getStatistics service:', error.message);
      throw error;
    }
  }

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
      console.log('Error in checkMonthlyLimit service:', error.message);
      throw error;
    }
  }

  async getTopCategories(limit = 5, userId) {
    try {
      return await expenseRepository.getTopCategories(limit, userId);
    } catch (error) {
      console.log('Error in getTopCategories service:', error.message);
      throw error;
    }
  }

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