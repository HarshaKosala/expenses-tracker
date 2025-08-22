# Expense Tracker Frontend

A React-based frontend application for the Personal Expense Tracker with modern UI and real-time data visualization.

## 🛠 Tech Stack

- **React 18** with Vite for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Chart.js** with react-chartjs-2 for data visualization
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for API communication

## 🏗 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Layout.jsx
│   │   └── ExpenseForm.jsx
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Expenses.jsx
│   │   └── Settings.jsx
│   ├── services/       # API service layer
│   │   └── api.js
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── vite.config.js      # Vite configuration
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup (Optional)
Create a `.env` file in the frontend directory if you need to customize the API URL:
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Start Development Server
```bash
npm run dev
```

The application will start on http://localhost:5173

## 📱 Features

### Dashboard
- **Real-time Statistics**: Total expenses, monthly spending, transaction count
- **Pie Chart Visualization**: Expense distribution by category
- **Top Categories**: Display highest spending categories
- **Monthly Limit Tracking**: Monitor spending against set limits
- **Smart Alerts**: Visual warnings when limits are approached/exceeded

### Expense Management
- **Add Expenses**: Quick form to add new expenses
- **Edit Expenses**: Modify existing expense details
- **Delete Expenses**: Remove expenses with confirmation
- **Filter & Search**: Filter by type, date range, and search by description
- **Responsive Table**: Clean table view with sorting

### Settings
- **Monthly Limit**: Set custom monthly spending limits
- **Alert Thresholds**: Configure warning percentages
- **Currency Selection**: Choose preferred currency
- **Real-time Updates**: Instant feedback on changes

## 🎨 UI Components

### Layout Component
- **Responsive Sidebar**: Collapsible navigation
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Active State**: Visual indication of current page

### ExpenseForm Component
- **Modal Design**: Overlay form for adding/editing expenses
- **Form Validation**: Real-time validation with error messages
- **Auto-complete**: Smart date and type selection
- **Responsive**: Works on all screen sizes

### Dashboard Components
- **Statistics Cards**: Key metrics display
- **Pie Chart**: Expense distribution visualization
- **Alert Banners**: Monthly limit warnings
- **Category List**: Top spending categories

## 🔧 Configuration

### Tailwind CSS
The application uses Tailwind CSS with custom color schemes:
- Primary colors (blue theme)
- Success colors (green theme)
- Warning colors (yellow theme)
- Danger colors (red theme)

### Vite Configuration
- **Development Server**: Port 5173
- **API Proxy**: Routes `/api` requests to backend
- **Hot Reload**: Instant updates during development
- **Build Optimization**: Optimized production builds

## 📊 Data Visualization

### Chart.js Integration
- **Pie Charts**: Expense distribution by category
- **Responsive Design**: Charts adapt to screen size
- **Custom Tooltips**: Formatted currency display
- **Color Schemes**: Consistent with application theme

### Real-time Updates
- **Live Data**: Charts update automatically
- **Smooth Animations**: Pleasant user experience
- **Error Handling**: Graceful fallbacks for missing data

## 🚀 Deployment

### Vercel
1. Import your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy with previews

### Environment Variables for Production
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 🎯 Key Features

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Experience**: Full-featured desktop interface

### User Experience
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Toast notifications for actions
- **Form Validation**: Real-time input validation

### Performance
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components load on demand
- **Optimized Builds**: Minified and compressed assets
- **Fast Refresh**: Instant updates during development

## 🔒 Security

- **Input Sanitization**: All user inputs are validated
- **XSS Protection**: React's built-in XSS protection
- **CORS Handling**: Proper cross-origin request handling
- **Environment Variables**: Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 