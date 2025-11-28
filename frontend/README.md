# BudgetFlow Frontend

A modern React + TypeScript expense tracking application with beautiful UI and real-time updates.

## 🚀 Features

- **User Authentication** - Secure login and registration
- **Expense Management** - Create, view, edit, and delete expenses
- **Budget Tracking** - Set and monitor category-based budgets with visual progress
- **Smart Settlements** - Optimized debt settlement calculations
- **Real-time Analytics** - Interactive charts and statistics
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Eye-friendly dark theme (coming soon)

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend API running (see backend README)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd budgetflow-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=BudgetFlow
```

### 4. Run the Application

#### Development Mode

```bash
npm run dev
```

The application will open at `http://localhost:3000`

#### Production Build

```bash
npm run build
```

The build folder will contain the optimized production files.

## 📁 Project Structure

```
budgetflow-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Dashboard/
│   │   │   ├── DashboardView.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── BudgetChart.tsx
│   │   ├── Expenses/
│   │   │   ├── ExpenseList.tsx
│   │   │   ├── ExpenseCard.tsx
│   │   │   └── AddExpenseModal.tsx
│   │   ├── Settlements/
│   │   │   ├── SettlementList.tsx
│   │   │   └── SettlementCard.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── Loading.tsx
│   ├── services/
│   │   ├── api.ts              # Axios instance
│   │   ├── authService.ts      # Auth API calls
│   │   ├── expenseService.ts   # Expense API calls
│   │   ├── budgetService.ts    # Budget API calls
│   │   └── settlementService.ts # Settlement API calls
│   ├── store/
│   │   ├── authStore.ts        # Auth state management
│   │   ├── expenseStore.ts     # Expense state
│   │   └── budgetStore.ts      # Budget state
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── formatters.ts       # Helper functions
│   │   └── validators.ts       # Validation functions
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── .env
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Zustand** - State management
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Router** - Routing
- **React Hot Toast** - Notifications

## 🔌 API Integration

The frontend communicates with the backend API. Ensure the backend is running before starting the frontend.

### API Configuration

Edit `src/services/api.ts` to configure the API base URL:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Authentication Flow

1. User logs in/registers
2. JWT token is stored in localStorage
3. Token is automatically included in all API requests
4. Token is validated on protected routes

## 📱 Features Walkthrough

### 1. Authentication

- **Register**: Create a new account with name, email, and password
- **Login**: Access your account with email and password
- **Profile**: View and update your profile information

### 2. Dashboard

- **Stats Cards**: View total spent, monthly expenses, and pending settlements
- **Budget Overview**: Monitor budget utilization with progress bars
- **Recent Expenses**: Quick view of latest transactions
- **Category Breakdown**: Visual representation of spending by category

### 3. Expense Management

- **Add Expense**: Create new expenses with description, amount, category, and split details
- **View Expenses**: Browse all expenses with filtering options
- **Edit Expense**: Update expense details
- **Delete Expense**: Remove expenses
- **Split Between Users**: Divide expenses among multiple users equally

### 4. Budget Tracking

- **Set Budgets**: Create monthly budgets for different categories
- **Monitor Progress**: Visual progress bars showing budget utilization
- **Alerts**: Get notified when approaching or exceeding budget limits
- **Monthly Overview**: See total budget vs actual spending

### 5. Settlements

- **Calculate Settlements**: Smart algorithm to minimize number of transactions
- **View Balances**: See who owes whom and how much
- **Settlement Summary**: Get overview of total amounts owed and owing
- **Mark as Settled**: Update settlement status

## 🎯 Usage Examples

### Creating an Expense

1. Click "Add Expense" button
2. Fill in details:
   - Description: "Team Dinner"
   - Amount: 2400
   - Category: Food
   - Date: Select date
   - Paid By: Select user
   - Split Between: Select participants
3. Click "Add Expense"

### Setting a Budget

1. Navigate to Dashboard
2. Click "Edit" on a budget card
3. Set monthly limit
4. Choose color and alert threshold
5. Click "Save"

### Viewing Settlements

1. Navigate to Settlements tab
2. View optimized settlement suggestions
3. See individual balances
4. Mark expenses as settled when paid

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... customize colors
        }
      }
    }
  }
}
```

### Adding New Categories

Update category enum in `src/types/index.ts`:

```typescript
export type Category = 
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Healthcare'
  | 'YourNewCategory';
```

## 🐛 Troubleshooting

### API Connection Issues

**Error: "Network Error" or "Failed to fetch"**

Solution:
1. Ensure backend is running on `http://localhost:5000`
2. Check CORS settings in backend
3. Verify `REACT_APP_API_URL` in `.env`

### Authentication Issues

**Error: "Token expired" or "Unauthorized"**

Solution:
1. Clear localStorage: `localStorage.clear()`
2. Login again
3. Check JWT_SECRET matches between frontend and backend

### Build Issues

**Error: "Module not found"**

Solution:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Scripts

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm test          # Run tests
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build the project
npm run build

# Deploy build folder through Netlify dashboard
# or use Netlify CLI
netlify deploy --prod --dir=build
```

### Environment Variables

Set these in your deployment platform:

```
REACT_APP_API_URL=https://your-backend-api.com/api
```

## 🔐 Security Best Practices

- Never commit `.env` file
- Store sensitive data in environment variables
- Validate all user inputs
- Sanitize data before sending to API
- Use HTTPS in production
- Implement rate limiting on API calls

## 🎓 Key Learnings

This project demonstrates:

- **Component Architecture**: Modular, reusable components
- **State Management**: Using Zustand for global state
- **API Integration**: RESTful API communication with Axios
- **TypeScript**: Strong typing for better code quality
- **Responsive Design**: Mobile-first approach with Tailwind
- **User Experience**: Intuitive UI with loading states and error handling

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📧 Support

For issues and questions:
- Open a GitHub issue
- Contact: support@budgetflow.com

---

Built with ❤️ using React, TypeScript, and Tailwind CSS