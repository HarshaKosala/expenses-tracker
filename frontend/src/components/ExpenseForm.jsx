import { useState, useEffect } from 'react'
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react'

const ExpenseForm = ({ expense, onSubmit, onCancel, currency = 'LKR' }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: '',
    date: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const expenseTypes = [
    'Food', 'Transport', 'Entertainment', 'Shopping', 
    'Bills', 'Healthcare', 'Education', 'Other'
  ]

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        type: expense.type,
        date: formatDate(new Date(expense.date), 'yyyy-MM-dd')
      })
    } else {
      // Set default date to today for new expenses
      setFormData({
        description: '',
        amount: '',
        type: '',
        date: formatDate(new Date(), 'yyyy-MM-dd')
      })
    }
  }, [expense])

  const formatDate = (date, formatStr) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    return formatStr
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 100) {
      newErrors.description = 'Description cannot exceed 100 characters'
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number'
    }

    if (!formData.type) {
      newErrors.type = 'Expense type is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        date: formData.date
      })
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {expense ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter expense description..."
                  className={`input pl-10 ${errors.description ? 'border-danger-500' : ''}`}
                  maxLength={100}
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-danger-600">{errors.description}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ({currency})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`input pl-10 ${errors.amount ? 'border-danger-500' : ''}`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-danger-600">{errors.amount}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Type
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.type ? 'border-danger-500' : ''}`}
                >
                  <option value="">Select expense type</option>
                  {expenseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-danger-600">{errors.type}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={formatDate(new Date(), 'yyyy-MM-dd')}
                  className={`input pl-10 ${errors.date ? 'border-danger-500' : ''}`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-danger-600">{errors.date}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary btn-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-md"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  expense ? 'Update Expense' : 'Add Expense'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ExpenseForm 