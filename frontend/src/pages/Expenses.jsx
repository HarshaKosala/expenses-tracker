import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react'
import { expenseAPI } from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import ExpenseForm from '../components/ExpenseForm'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filters, setFilters] = useState({
    description: '',
    type: '',
    startDate: '',
    endDate: ''
  })

  const expenseTypes = [
    'Food', 'Transport', 'Entertainment', 'Shopping', 
    'Bills', 'Healthcare', 'Education', 'Other'
  ]

  useEffect(() => {
    loadExpenses()
  }, [filters])

  const loadExpenses = async () => {
    try {
      setLoading(true)
      const response = await expenseAPI.getExpenses(filters)
      setExpenses(response.data)
    } catch (error) {
      toast.error('Failed to load expenses')
      console.error('Load expenses error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      await expenseAPI.deleteExpense(id)
      toast.success('Expense deleted successfully')
      loadExpenses()
    } catch (error) {
      toast.error('Failed to delete expense')
      console.error('Delete expense error:', error)
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleFormSubmit = async (expenseData) => {
    try {
      if (editingExpense) {
        await expenseAPI.updateExpense(editingExpense._id, expenseData)
        toast.success('Expense updated successfully')
      } else {
        await expenseAPI.createExpense(expenseData)
        toast.success('Expense added successfully')
      }
      setShowForm(false)
      setEditingExpense(null)
      loadExpenses()
    } catch (error) {
      toast.error(editingExpense ? 'Failed to update expense' : 'Failed to add expense')
      console.error('Form submit error:', error)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount)
  }

  const getTypeColor = (type) => {
    const colors = {
      Food: 'bg-orange-100 text-orange-800',
      Transport: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Healthcare: 'bg-green-100 text-green-800',
      Education: 'bg-indigo-100 text-indigo-800',
      Other: 'bg-gray-100 text-gray-800'
    }
    return colors[type] || colors.Other
  }

  const clearFilters = () => {
    setFilters({
      description: '',
      type: '',
      startDate: '',
      endDate: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your personal expenses
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-md mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search description..."
                  value={filters.description}
                  onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input"
              >
                <option value="">All Types</option>
                {expenseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Expense List</h3>
          <p className="text-sm text-gray-500">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-500 mb-4">
                {Object.values(filters).some(f => f) 
                  ? 'Try adjusting your filters' 
                  : 'Get started by adding your first expense'
                }
              </p>
              {!Object.values(filters).some(f => f) && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Expense
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {expense.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(expense.type)}`}>
                          {expense.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="text-danger-600 hover:text-danger-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}

export default Expenses 