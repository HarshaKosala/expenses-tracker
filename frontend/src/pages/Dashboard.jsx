import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  PieChart
} from 'lucide-react'
import { expenseAPI, settingsAPI } from '../services/api'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { formatCurrency } from '../utils/helpers'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null)
  const [monthlyLimit, setMonthlyLimit] = useState(null)
  const [expensesByType, setExpensesByType] = useState([])
  const [settings, setSettings] = useState({ currency: 'LKR' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, limitData, typeData, settingsData] = await Promise.all([
        expenseAPI.getStatistics(),
        expenseAPI.checkMonthlyLimit(),
        expenseAPI.getExpensesByType(),
        settingsAPI.getSettings()
      ])

      setStatistics(statsData.data)
      setMonthlyLimit(limitData.data)
      setExpensesByType(typeData.data)
      setSettings(settingsData.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard data error:', error)
    } finally {
      setLoading(false)
    }
  }



  const getChartData = () => {
    if (!expensesByType.length) return null

    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
      '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
    ]

    return {
      labels: expensesByType.map(item => item._id),
      datasets: [
        {
          data: expensesByType.map(item => item.total),
          backgroundColor: colors.slice(0, expensesByType.length),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed
            return `${label}: ${formatCurrency(value, settings.currency)}`
          }
        }
      }
    },
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your personal finances
        </p>
      </div>

      {/* Monthly Limit Alert */}
      {monthlyLimit && monthlyLimit.isAlertThresholdReached && (
        <div className={`rounded-lg p-4 ${
          monthlyLimit.isLimitExceeded 
            ? 'bg-danger-50 border border-danger-200' 
            : 'bg-warning-50 border border-warning-200'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className={`h-5 w-5 ${
              monthlyLimit.isLimitExceeded ? 'text-danger-400' : 'text-warning-400'
            }`} />
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                monthlyLimit.isLimitExceeded ? 'text-danger-800' : 'text-warning-800'
              }`}>
                {monthlyLimit.isLimitExceeded ? 'Monthly Limit Exceeded!' : 'Monthly Limit Warning'}
              </h3>
              <div className={`mt-2 text-sm ${
                monthlyLimit.isLimitExceeded ? 'text-danger-700' : 'text-warning-700'
              }`}>
                <p>
                                  You've spent {formatCurrency(monthlyLimit.monthlyTotal, settings.currency)} out of {formatCurrency(monthlyLimit.monthlyLimit, settings.currency)} 
                ({monthlyLimit.percentageUsed}% of your monthly limit)
                </p>
                {!monthlyLimit.isLimitExceeded && (
                  <p className="mt-1">
                    Remaining: {formatCurrency(monthlyLimit.remaining, settings.currency)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 pt-5">Total Expenses</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistics ? formatCurrency(statistics.totalExpenses, settings.currency) : `${settings.currency} 0.00`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 pt-5">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {monthlyLimit ? formatCurrency(monthlyLimit.monthlyTotal, settings.currency) : `${settings.currency} 0.00`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 pt-5">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistics ? statistics.totalCount : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 pt-5">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {expensesByType.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Expense Distribution Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Expense Distribution</h3>
            <p className="text-sm text-gray-500">
              Breakdown of expenses by category this month
            </p>
          </div>
          <div className="card-content">
            {getChartData() ? (
              <div className="h-80">
                <Pie data={getChartData()} options={chartOptions} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No expense data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Categories</h3>
            <p className="text-sm text-gray-500">
              Your highest spending categories
            </p>
          </div>
          <div className="card-content">
            {expensesByType.length > 0 ? (
              <div className="space-y-4">
                {expensesByType.slice(0, 5).map((category, index) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] || '#6B7280'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        {category._id}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(category.total, settings.currency)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.count} transaction{category.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No category data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 