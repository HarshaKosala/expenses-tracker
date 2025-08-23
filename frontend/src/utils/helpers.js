// Format currency for display
export const formatCurrency = (amount, currency = 'LKR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get color for expense type
export const getTypeColor = (type) => {
  const colors = {
    Food: 'text-green-600 bg-green-100',
    Transport: 'text-blue-600 bg-blue-100',
    Entertainment: 'text-purple-600 bg-purple-100',
    Shopping: 'text-orange-600 bg-orange-100',
    Bills: 'text-red-600 bg-red-100',
    Healthcare: 'text-pink-600 bg-pink-100',
    Education: 'text-indigo-600 bg-indigo-100',
    Other: 'text-gray-600 bg-gray-100'
  }
  return colors[type] || colors.Other
}
