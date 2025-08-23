import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL 
const API_BASE_URL = apiUrl || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// Expense API
export const expenseAPI = {
  // Get all expenses
  getExpenses: (filters = {}) => api.get('/expenses', { params: filters }),
  
  // Get expense by ID
  getExpenseById: (id) => api.get(`/expenses/${id}`),
  
  // Create expense
  createExpense: (expenseData) => api.post('/expenses', expenseData),
  
  // Update expense
  updateExpense: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
  
  // Delete expense
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  
  // Get current month expenses
  getCurrentMonthExpenses: () => api.get('/expenses/current-month'),
  
  // Get statistics
  getStatistics: () => api.get('/expenses/statistics'),
  
  // Check monthly limit
  checkMonthlyLimit: () => api.get('/expenses/monthly-limit'),
  
  // Get expenses by type for current month
  getExpensesByType: () => api.get('/expenses/by-type'),
  
  // Get top categories
  getTopCategories: (limit = 5) => api.get('/expenses/top-categories', { params: { limit } }),
}

// Settings API
export const settingsAPI = {
  // Get all settings
  getSettings: () => api.get('/settings'),
  
  // Update settings
  updateSettings: (settingsData) => api.put('/settings', settingsData),
  
  // Get monthly limit
  getMonthlyLimit: () => api.get('/settings/monthly-limit'),
  
  // Update monthly limit
  updateMonthlyLimit: (limit) => api.put('/settings/monthly-limit', { monthlyExpenseLimit: limit }),
  
  // Get alert threshold
  getAlertThreshold: () => api.get('/settings/alert-threshold'),
  
  // Update alert threshold
  updateAlertThreshold: (threshold) => api.put('/settings/alert-threshold', { alertThreshold: threshold }),
}

export default api 