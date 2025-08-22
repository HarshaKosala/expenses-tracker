# Expense Tracker Backend

A Node.js Express API backend for the Personal Expense Tracker application with MongoDB integration.

## 🛠 Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Express Validator** for input validation
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for HTTP request logging

## 🏗 Architecture

This backend follows a clean architecture pattern:

```
backend/
├── config/          # Database configuration
├── controllers/     # HTTP request handlers
├── models/          # MongoDB schemas
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── services/        # Business logic layer
└── server.js        # Main application entry point
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
1. Copy the environment example file:
```bash
cp env.example .env
```

2. Update the `.env` file with your MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DEFAULT_MONTHLY_LIMIT=10000
```

### 3. Start Development Server
```bash
npm run dev
```

The server will start on http://localhost:5001

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Expenses
- `GET /api/expenses` - Get all expenses with optional filtering
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/current-month` - Get current month expenses
- `GET /api/expenses/statistics` - Get expense statistics
- `GET /api/expenses/monthly-limit` - Check monthly limit status
- `GET /api/expenses/by-type` - Get expenses by type for current month
- `GET /api/expenses/top-categories` - Get top expense categories

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/monthly-limit` - Get monthly limit
- `PUT /api/settings/monthly-limit` - Update monthly limit
- `GET /api/settings/alert-threshold` - Get alert threshold
- `PUT /api/settings/alert-threshold` - Update alert threshold

## 📊 Data Models

### Expense Model
```javascript
{
  description: String,    // Required, max 100 chars
  amount: Number,         // Required, positive number
  type: String,          // Required, enum: Food, Transport, Entertainment, etc.
  date: Date,            // Required, cannot be future date
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### Settings Model
```javascript
{
  monthlyExpenseLimit: Number,  // Required, positive number
  currency: String,             // Default: 'LKR'
  alertThreshold: Number,       // Default: 90, range: 0-100
  createdAt: Date,             // Auto-generated
  updatedAt: Date              // Auto-generated
}
```

## 🔍 Query Parameters

### Expense Filtering
- `description` - Search by description (case-insensitive)
- `type` - Filter by expense type
- `startDate` - Filter expenses from this date (ISO format)
- `endDate` - Filter expenses until this date (ISO format)
- `limit` - Limit number of results
- `skip` - Skip number of results (for pagination)

### Example Queries
```bash
# Get all food expenses
GET /api/expenses?type=Food

# Get expenses in date range
GET /api/expenses?startDate=2024-01-01&endDate=2024-01-31

# Search expenses by description
GET /api/expenses?description=grocery

# Paginated results
GET /api/expenses?limit=10&skip=20
```

## 🚀 Deployment

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Render
1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
PORT=5001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Express validator middleware
- **Rate Limiting** - Built-in protection
- **Error Handling** - Comprehensive error responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 