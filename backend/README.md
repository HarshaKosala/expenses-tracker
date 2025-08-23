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

2. Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DEFAULT_MONTHLY_LIMIT=10000
JWT_SECRET=your-jwt-secret-key
# Optional: Override API URL for Swagger docs
# API_URL=https://your-custom-domain.com/api
```

### 3. Start Development Server
```bash
npm run dev
```

The server will start on http://localhost:5001

## API Documentation

Interactive Swagger UI available at: http://localhost:5001/api-docs

Features:
- Interactive API testing
- Request/response examples
- Authentication support
- Works in both local and production

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/auth/profile` - Get current user profile (protected)

### Expenses (Protected)
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

### Settings (Protected)
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
- `GET /api/settings/monthly-limit` - Get monthly limit
- `PUT /api/settings/monthly-limit` - Update monthly limit
- `GET /api/settings/alert-threshold` - Get alert threshold
- `PUT /api/settings/alert-threshold` - Update alert threshold

## 📊 Data Models

### User Model
```javascript
{
  username: String,      // Required, unique, 3-30 chars
  email: String,         // Required, unique, valid email
  password: String,      // Required, hashed with bcrypt
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### Expense Model
```javascript
{
  description: String,    // Required, max 100 chars
  amount: Number,         // Required, positive number
  type: String,          // Required, enum: Food, Transport, Entertainment, etc.
  date: Date,            // Required, cannot be future date
  user: ObjectId,        // Required, reference to User
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
  user: ObjectId,              // Required, reference to User
  createdAt: Date,             // Auto-generated
  updatedAt: Date              // Auto-generated
}
```

## 🔐 Authentication

### JWT Token
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token
1. Register a new user: `POST /api/auth/register`
2. Login to get token: `POST /api/auth/login`
3. Use the returned token in subsequent requests

### Protected Endpoints
- All expense endpoints (`/api/expenses/*`)
- All settings endpoints (`/api/settings/*`)
- User profile endpoint (`/api/auth/profile`)

## 🔍 Query Parameters

### Expense Filtering
- `description` - Search by description (case-insensitive)
- `type` - Filter by expense type
- `startDate` - Filter expenses from this date (ISO format)
- `endDate` - Filter expenses until this date (ISO format)
- `limit` - Limit number of results
- `skip` - Skip number of results (for pagination)

### Example Requests

#### Authentication
```bash
# Register a new user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com", "password": "password123"}'

# Login to get JWT token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# Use token for protected requests
curl -X GET http://localhost:5001/api/expenses \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Expense Queries
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
JWT_SECRET=your-production-jwt-secret
# Railway automatically provides:
# - PORT
# - RAILWAY_STATIC_URL (your app's domain)
# Optional: Override API URL for Swagger docs
# API_URL=https://your-custom-domain.com/api
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