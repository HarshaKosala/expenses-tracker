import { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  Bell,
  Save,
  AlertTriangle
} from 'lucide-react'
import { settingsAPI } from '../services/api'
import toast from 'react-hot-toast'

const Settings = () => {
  const [settings, setSettings] = useState({
    monthlyExpenseLimit: 10000,
    alertThreshold: 90,
    currency: 'LKR'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await settingsAPI.getSettings()
      setSettings(response.data)
    } catch (error) {
      toast.error('Failed to load settings')
      console.error('Load settings error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: name === 'monthlyExpenseLimit' || name === 'alertThreshold' 
        ? parseFloat(value) 
        : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!settings.monthlyExpenseLimit || settings.monthlyExpenseLimit <= 0) {
      newErrors.monthlyExpenseLimit = 'Monthly expense limit must be greater than 0'
    }

    if (settings.alertThreshold < 0 || settings.alertThreshold > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      await settingsAPI.updateSettings(settings)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Save settings error:', error)
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your expense tracking preferences
        </p>
      </div>

      {/* Settings Form */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
          </div>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Monthly Expense Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Expense Limit
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="monthlyExpenseLimit"
                  value={settings.monthlyExpenseLimit}
                  onChange={handleChange}
                  placeholder="10000"
                  step="0.01"
                  min="0"
                  className={`input pl-10 ${errors.monthlyExpenseLimit ? 'border-danger-500' : ''}`}
                />
              </div>
              {errors.monthlyExpenseLimit && (
                <p className="mt-1 text-sm text-danger-600">{errors.monthlyExpenseLimit}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Set your maximum monthly spending limit. You'll receive alerts when you reach {settings.alertThreshold}% of this limit.
              </p>
            </div>

            {/* Alert Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Threshold (%)
              </label>
              <div className="relative">
                <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="alertThreshold"
                  value={settings.alertThreshold}
                  onChange={handleChange}
                  placeholder="90"
                  step="1"
                  min="0"
                  max="100"
                  className={`input pl-10 ${errors.alertThreshold ? 'border-danger-500' : ''}`}
                />
              </div>
              {errors.alertThreshold && (
                <p className="mt-1 text-sm text-danger-600">{errors.alertThreshold}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Receive a warning when you've spent {settings.alertThreshold}% of your monthly limit.
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="input"
              >
                <option value="LKR">Sri Lankan Rupee (LKR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select your preferred currency for displaying amounts.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-4">
              <button
                type="submit"
                className="btn btn-primary btn-md"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current Limit Info */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Current Monthly Limit</h3>
            </div>
          </div>
          <div className="card-content">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">
                {formatCurrency(settings.monthlyExpenseLimit)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Maximum amount you can spend per month
              </p>
            </div>
          </div>
        </div>

        {/* Alert Info */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning-600" />
              <h3 className="text-lg font-medium text-gray-900">Alert Threshold</h3>
            </div>
          </div>
          <div className="card-content">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600">
                {settings.alertThreshold}%
              </p>
              <p className="text-sm text-gray-500 mt-2">
                You'll be warned when you reach this percentage of your limit
              </p>
              <p className="text-sm text-gray-400 mt-1">
                ({formatCurrency(settings.monthlyExpenseLimit * settings.alertThreshold / 100)})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">How it works</h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">1</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Set your monthly limit</p>
                <p className="text-sm text-gray-500">
                  Define how much you want to spend each month on expenses.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">2</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Configure alerts</p>
                <p className="text-sm text-gray-500">
                  Choose when you want to be notified about your spending progress.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">3</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Track your progress</p>
                <p className="text-sm text-gray-500">
                  Monitor your spending on the dashboard and receive alerts when needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 