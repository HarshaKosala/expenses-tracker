# Expense Tracker Frontend

React app for tracking personal expenses with user authentication.

## Tech Stack

- React 18 + Vite
- React Router
- Tailwind CSS
- Chart.js
- Axios

## Project Structure

```
src/
├── components/     # Layout, ExpenseForm, ProtectedRoute
├── pages/         # Dashboard, Expenses, Settings, Login, Register
├── services/      # API calls
├── contexts/      # AuthContext
└── utils/         # Helper functions
```

## Prerequisites

- Node.js (v16+)
- Backend API running

## Quick Start

```bash
npm install
npm run dev
```

App runs on http://localhost:5173

## Features

- User registration and login
- Dashboard with expense charts
- Add, edit, delete expenses
- Filter expenses by type and date
- Monthly spending limits
- Currency settings

## Components

- Layout - Navigation sidebar
- ExpenseForm - Add/edit expense modal
- Dashboard - Charts and stats
- ProtectedRoute - Auth guard

## Configuration

- Port 5173
- API URL via environment variables
- Tailwind CSS styling

## Data Visualization

- Pie charts for expense categories
- Real-time updates
- Responsive design

## Deployment

### Vercel
1. Import repository
2. Build command: `npm run build`
3. Output directory: `dist`

### Environment
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build

## Security

- JWT authentication
- Input validation
- CORS handling 