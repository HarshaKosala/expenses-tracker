const Expense = require('../models/Expense');

class ExpenseRepository {
  async createExpense(expenseData) {
    try {
      const expense = new Expense(expenseData);
      return await expense.save();
    } catch (error) {
      console.log('Error creating expense:', error.message);
      throw error;
    }
  }

  async getExpenses(filters = {}) {
    try {
      const query = { user: filters.userId };
      
      if (filters.startDate && filters.endDate) {
        query.date = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      } else if (filters.startDate) {
        query.date = { $gte: new Date(filters.startDate) };
      } else if (filters.endDate) {
        query.date = { $lte: new Date(filters.endDate) };
      }

      if (filters.type) {
        query.type = filters.type;
      }

      if (filters.description) {
        query.description = { $regex: filters.description, $options: 'i' };
      }

      const options = {
        sort: { date: -1 }
      };

      if (filters.limit) {
        options.limit = parseInt(filters.limit);
      }

      if (filters.skip) {
        options.skip = parseInt(filters.skip);
      }

      return await Expense.find(query, null, options);
    } catch (error) {
      console.log('Error fetching expenses:', error.message);
      throw error;
    }
  }

  async getExpenseById(id, userId) {
    try {
      return await Expense.findOne({ _id: id, user: userId });
    } catch (error) {
      console.log('Error fetching expense by ID:', error.message);
      throw error;
    }
  }

  async updateExpense(id, updateData, userId) {
    try {
      return await Expense.findOneAndUpdate(
        { _id: id, user: userId },
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.log('Error updating expense:', error.message);
      throw error;
    }
  }

  async removeExpense(id, userId) {
    try {
      return await Expense.findOneAndDelete({ _id: id, user: userId });
    } catch (error) {
      console.log('Error removing expense:', error.message);
      throw error;
    }
  }

  async getExpensesByMonth(year, month, userId) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      return await Expense.find({
        user: userId,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });
    } catch (error) {
      console.log('Error fetching monthly expenses:', error.message);
      throw error;
    }
  }

  async getMonthlyTotal(year, month, userId) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const result = await Expense.aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      return result.length > 0 ? result[0].total : 0;
    } catch (error) {
      console.log('Error calculating monthly total:', error.message);
      throw error;
    }
  }

  async getMonthlyExpensesByType(year, month, userId) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      return await Expense.aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { total: -1 }
        }
      ]);
    } catch (error) {
      console.log('Error fetching monthly expenses by type:', error.message);
      throw error;
    }
  }

  async getTopCategories(limit = 5, userId) {
    try {
      return await Expense.aggregate([
        {
          $match: { user: userId }
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { total: -1 }
        },
        {
          $limit: limit
        }
      ]);
    } catch (error) {
      console.log('Error fetching top categories:', error.message);
      throw error;
    }
  }

  async getExpenseStats(userId) {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const [totalExpenses, monthlyTotal, topCategories] = await Promise.all([
        Expense.aggregate([
          {
            $match: { user: userId }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]),
        this.getMonthlyTotal(currentYear, currentMonth, userId),
        this.getTopCategories(5, userId)
      ]);

      return {
        totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
        totalCount: totalExpenses.length > 0 ? totalExpenses[0].count : 0,
        monthlyTotal,
        topCategories
      };
    } catch (error) {
      console.log('Error fetching expense stats:', error.message);
      throw error;
    }
  }
}

module.exports = new ExpenseRepository(); 