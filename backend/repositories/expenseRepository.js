const Expense = require('../models/Expense');

class ExpenseRepository {
  // Create a new expense
  async create(expenseData) {
    try {
      const expense = new Expense(expenseData);
      return await expense.save();
    } catch (error) {
      throw error;
    }
  }

  // Get all expenses with optional filtering
  async findAll(filters = {}) {
    try {
      const query = {};
      
      // Date range filter
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

      // Type filter
      if (filters.type) {
        query.type = filters.type;
      }

      // Description search
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
      throw error;
    }
  }

  // Get expense by ID
  async findById(id) {
    try {
      return await Expense.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Update expense
  async update(id, updateData) {
    try {
      return await Expense.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Delete expense
  async delete(id) {
    try {
      return await Expense.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Get expenses by month
  async getExpensesByMonth(year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      return await Expense.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });
    } catch (error) {
      throw error;
    }
  }

  // Get total expenses by month
  async getTotalExpensesByMonth(year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const result = await Expense.aggregate([
        {
          $match: {
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
      throw error;
    }
  }

  // Get expenses by type for current month
  async getExpensesByTypeForMonth(year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      return await Expense.aggregate([
        {
          $match: {
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
      throw error;
    }
  }

  // Get top expense categories
  async getTopCategories(limit = 5) {
    try {
      return await Expense.aggregate([
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
      throw error;
    }
  }

  // Get expense statistics
  async getStatistics() {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const [totalExpenses, monthlyTotal, topCategories] = await Promise.all([
        Expense.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]),
        this.getTotalExpensesByMonth(currentYear, currentMonth),
        this.getTopCategories(5)
      ]);

      return {
        totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
        totalCount: totalExpenses.length > 0 ? totalExpenses[0].count : 0,
        monthlyTotal,
        topCategories
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExpenseRepository(); 