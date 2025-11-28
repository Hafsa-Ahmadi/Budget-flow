# 💰 BudgetFlow - Expense Tracker & Budget Manager

A full-stack expense tracking and splitting application inspired by Splitwise and Money Manager. Built with React, TypeScript, Node.js, Express, and MongoDB.

![BudgetFlow Banner](https://via.placeholder.com/1200x400/3b82f6/ffffff?text=BudgetFlow+-+Track+%26+Split+Expenses)

## 📺 Demo Video

> **Important**: Please watch the demo video to see the application in action

[Link to Demo Video - Google Drive / YouTube]

## ✨ Key Features

### 🎯 Core Functionality

- **Multi-User Expense Splitting** - Split bills equally among friends and family
- **Budget Management** - Set monthly budgets for different categories with visual progress tracking
- **Smart Settlement Calculator** - Optimized algorithm to minimize the number of transactions needed
- **Real-time Dashboard** - Interactive charts and statistics showing spending patterns
- **Category-Based Tracking** - Organize expenses by Food, Transport, Shopping, Entertainment, Bills, etc.
- **Receipt Management** - Upload and store receipt images (ready for OCR integration)

### 🔐 Security & Authentication

- JWT-based authentication
- Secure password hashing with bcrypt
- Protected API routes
- Token-based session management

### 📊 Analytics & Insights

- Expense statistics by category
- Monthly spending trends
- Budget utilization percentages
- Settlement summaries

### 💻 Technical Highlights

- **Full TypeScript Implementation** - Type-safe code across frontend and backend
- **RESTful API Design** - Well-structured endpoints following REST principles
- **MongoDB Aggregation** - Complex queries for statistics and analytics
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Error Handling** - Comprehensive error handling and validation
- **Code Quality** - ESLint, Prettier, and strict TypeScript configuration

## 🏗️ Architecture

### Frontend Stack

- **React 18** - Modern React with Hooks
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **Recharts** - Data visualization
- **React Router** - Client-side routing

### Backend Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe backend code
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
budgetflow/
├── frontend/                   # React TypeScript application
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper functions
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── config/            # Configuration files
│   │   └── server.ts          # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 5.0 (local or Atlas)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd budgetflow
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Important: Set MONGODB_URI and JWT_SECRET

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the frontend app
npm run dev
```

Frontend will open at `http://localhost:3000`

### 4. Test the Application

1. Register a new user
2. Login with credentials
3. Add some expenses
4. Set monthly budgets
5. View settlements

## 📖 Detailed Setup Instructions

### MongoDB Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

### Environment Variables

**Backend (.env)**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/budgetflow
JWT_SECRET=your_super_secret_key_min_32_characters
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎨 Features Demonstration

### 1. User Authentication

- **Register**: Create account with name, email, password
- **Login**: Secure authentication with JWT
- **Profile Management**: Update user details

### 2. Expense Management

```
Add Expense:
- Description: "Team Dinner at Restaurant"
- Amount: ₹2,400
- Category: Food
- Paid By: User A
- Split Between: User A, User B, User C, User D
- Result: Each person owes ₹600
```

### 3. Budget Tracking

```
Set Budget:
- Category: Food
- Monthly Limit: ₹5,000
- Current Spent: ₹600
- Progress: 12% (Visual progress bar)
- Alert at: 80% utilization
```

### 4. Smart Settlements

```
Scenario:
- User A paid ₹2,400, split 4 ways
- User B paid ₹800, split 2 ways
- User C paid ₹0

Algorithm calculates minimal transactions:
- User C pays ₹975 to User A
- User D pays ₹600 to User A
```

## 🔌 API Documentation

### Authentication Endpoints

```
POST /api/auth/register       - Register new user
POST /api/auth/login          - Login user
GET  /api/auth/me             - Get current user
PUT  /api/auth/profile        - Update profile
PUT  /api/auth/change-password - Change password
```

### Expense Endpoints

```
GET    /api/expenses          - Get all expenses (with filters)
POST   /api/expenses          - Create new expense
GET    /api/expenses/:id      - Get single expense
PUT    /api/expenses/:id      - Update expense
DELETE /api/expenses/:id      - Delete expense
PUT    /api/expenses/:id/settle - Mark as settled
GET    /api/expenses/stats    - Get expense statistics
```

### Budget Endpoints

```
GET    /api/budgets           - Get all budgets
POST   /api/budgets           - Create/update budget
GET    /api/budgets/:id       - Get single budget
PUT    /api/budgets/:id       - Update budget
DELETE /api/budgets/:id       - Delete budget
GET    /api/budgets/overview  - Get budget overview
```

### Settlement Endpoints

```
GET /api/settlements          - Calculate settlements
GET /api/settlements/summary  - Get settlement summary
GET /api/settlements/group/:id - Get group settlements
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Create expense with multiple users
- [ ] View expense list with filters
- [ ] Update and delete expenses
- [ ] Set monthly budgets
- [ ] View budget progress bars
- [ ] Calculate settlements correctly
- [ ] Mark expenses as settled
- [ ] View dashboard statistics

## 🎯 Code Quality & Best Practices

### TypeScript Implementation

- ✅ Strict type checking enabled
- ✅ No `any` types used
- ✅ Interface definitions for all data models
- ✅ Type-safe API calls

### Component Architecture

- ✅ Modular, reusable components
- ✅ Separation of concerns
- ✅ Custom hooks for logic reuse
- ✅ Proper prop typing

### Backend Design

- ✅ MVC architecture
- ✅ RESTful API design
- ✅ Middleware for authentication
- ✅ Error handling middleware
- ✅ Input validation
- ✅ MongoDB indexes for performance

### Code Organization

- ✅ Clear folder structure
- ✅ Consistent naming conventions
- ✅ ESLint configuration
- ✅ Prettier formatting
- ✅ Comprehensive comments

## 🚀 Deployment

### Backend Deployment (Heroku)

```bash
cd backend
heroku create budgetflow-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<atlas-uri>
heroku config:set JWT_SECRET=<secret>
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel
# Follow prompts
# Set REACT_APP_API_URL environment variable
```

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Expenses Collection

```javascript
{
  _id: ObjectId,
  description: String,
  amount: Number,
  category: String,
  date: Date,
  paidBy: ObjectId (ref: User),
  splitBetween: [{
    userId: ObjectId (ref: User),
    amount: Number,
    paid: Boolean
  }],
  receiptUrl: String,
  notes: String,
  settled: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Budgets Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  category: String,
  limit: Number,
  spent: Number,
  month: Number,
  year: Number,
  color: String,
  alertThreshold: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎓 Key Learning Outcomes

This project demonstrates expertise in:

1. **Full-Stack Development** - Complete MERN stack implementation
2. **TypeScript Mastery** - Type-safe code across entire stack
3. **API Design** - RESTful principles and best practices
4. **State Management** - Efficient global state handling
5. **Database Design** - Schema design and optimization
6. **Authentication** - Secure JWT-based auth flow
7. **Algorithm Design** - Settlement optimization algorithm
8. **Responsive UI** - Mobile-first design approach
9. **Error Handling** - Comprehensive error management
10. **Code Quality** - Clean, maintainable, well-documented code

## 🔮 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Receipt OCR for automatic expense entry
- [ ] Export to PDF/Excel
- [ ] Email notifications for settlements
- [ ] Group management for shared expenses
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Social features (friends, requests)

## 🐛 Known Issues

- None currently. If you find any, please report them!

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Created as part of a technical assessment demonstrating full-stack development skills.

## 🙏 Acknowledgments

- Inspired by Splitwise and Money Manager
- Built with modern web technologies
- Focused on code quality and best practices

## 📧 Contact

For any questions or feedback:
- Open a GitHub issue
- Email: [hafsaahamadi@gmail.com]

---

**⭐ If you found this project helpful, please consider giving it a star!**

Built with ❤️ using React, TypeScript, Node.js, Express, and MongoDB