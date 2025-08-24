# Personal Expense Tracker

A full-stack web application for tracking personal expenses with React frontend and Node.js backend.

## Features

- **User Authentication** (Register/Login with JWT)
- Add, edit, and delete expenses
- Categorize expenses (Food, Transport, Entertainment, etc.)
- Dashboard with charts and statistics
- Monthly expense limits with alerts
- Responsive design for mobile and desktop
- Real-time data updates

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Chart.js
**Backend:** Node.js, Express, MongoDB, Mongoose

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd personal-expense-tracker
```

2. Backend setup
```bash
cd backend
npm install
cp env.example .env
# Add your MongoDB connection string to .env
npm run dev
```

3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

4. Access the application
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Environment Variables

**Backend (.env)**
```
MONGODB_URI=your-mongodb-connection-string
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-jwt-secret-key
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5001/api
```

## Project Structure

```
personal-expense-tracker/
├── frontend/          # React application
├── backend/           # Node.js API
├── .gitignore
└── README.md
```

## API Endpoints

### Public
- `GET /api/health` - Health check
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Protected (Require JWT Token)
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/statistics` - Get statistics
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `GET /api/auth/profile` - Get user profile

## Deployment

**Backend:** Railway, Render, or Heroku
**Frontend:** Vercel, Netlify, or GitHub Pages

## License

MIT License 