# BudgetFlow Backend API

A robust Node.js + TypeScript + MongoDB backend for the BudgetFlow expense tracking and splitting application.

## 🚀 Features

- **User Authentication** - JWT-based secure authentication
- **Expense Management** - Create, read, update, delete expenses with split functionality
- **Budget Tracking** - Set and monitor category-based budgets
- **Smart Settlements** - Optimized debt settlement calculations
- **Real-time Analytics** - Expense statistics and budget insights
- **Group Management** - Support for expense groups
- **Data Validation** - Comprehensive input validation and error handling

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 5.0 (local or Atlas)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd budgetflow-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/budgetflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 4. MongoDB Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB locally
# For macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify MongoDB is running
mongosh
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/budgetflow?retryWrites=true&w=majority
```

### 5. Run the Application

#### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000` with auto-reload enabled.

#### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
budgetflow-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── expenseController.ts # Expense CRUD operations
│   │   ├── budgetController.ts  # Budget management
│   │   └── settlementController.ts # Settlement calculations
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── Expense.ts           # Expense schema
│   │   ├── Budget.ts            # Budget schema
│   │   └── Group.ts             # Group schema
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── errorHandler.ts     # Error handling
│   ├── routes/
│   │   ├── authRoutes.ts        # Auth endpoints
│   │   ├── expenseRoutes.ts     # Expense endpoints
│   │   ├── budgetRoutes.ts      # Budget endpoints
│   │   └── settlementRoutes.ts  # Settlement endpoints
│   └── server.ts                # Main server file
├── dist/                        # Compiled JavaScript (generated)
├── .env                         # Environment variables
├── .env.example                 # Example environment file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login user
GET    /api/auth/me             # Get current user (Protected)
PUT    /api/auth/profile        # Update profile (Protected)
PUT    /api/auth/change-password # Change password (Protected)
```

### Expenses

```
GET    /api/expenses            # Get all expenses (Protected)
POST   /api/expenses            # Create expense (Protected)
GET    /api/expenses/:id        # Get single expense (Protected)
PUT    /api/expenses/:id        # Update expense (Protected)
DELETE /api/expenses/:id        # Delete expense (Protected)
PUT    /api/expenses/:id/settle # Mark as settled (Protected)
GET    /api/expenses/stats      # Get expense statistics (Protected)
```

### Budgets

```
GET    /api/budgets             # Get all budgets (Protected)
POST   /api/budgets             # Create/update budget (Protected)
GET    /api/budgets/:id         # Get single budget (Protected)
PUT    /api/budgets/:id         # Update budget (Protected)
DELETE /api/budgets/:id         # Delete budget (Protected)
GET    /api/budgets/overview    # Get budget overview (Protected)
```

### Settlements

```
GET    /api/settlements         # Calculate settlements (Protected)
GET    /api/settlements/summary # Get settlement summary (Protected)
GET    /api/settlements/group/:groupId # Group settlements (Protected)
```

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create expense (use token from login)
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description":"Team Dinner",
    "amount":2400,
    "category":"Food",
    "paidBy":"USER_ID",
    "splitBetween":["USER_ID_1","USER_ID_2"]
  }'
```

### Using Postman

1. Import the API collection
2. Set base URL: `http://localhost:5000/api`
3. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`

## 📊 Data Models

### User Model

```typescript
{
  name: string;
  email: string;
  password: string (hashed);
  phoneNumber?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Expense Model

```typescript
{
  description: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Entertainment' | 'Bills';
  date: Date;
  paidBy: ObjectId (ref: User);
  splitBetween: [{
    userId: ObjectId (ref: User);
    amount: number;
    paid: boolean;
  }];
  receiptUrl?: string;
  notes?: string;
  settled: boolean;
  createdBy: ObjectId (ref: User);
}
```

### Budget Model

```typescript
{
  userId: ObjectId (ref: User);
  category: string;
  limit: number;
  spent: number;
  month: number;
  year: number;
  color: string;
  alertThreshold: number;
}
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting ready
- CORS protection
- Helmet security headers
- Error handling without exposing sensitive data

## 🐛 Debugging

### Common Issues

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod  # Linux
```

**Port Already in Use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

**JWT Token Issues:**
- Ensure JWT_SECRET is set in .env
- Check token format: `Bearer <token>`
- Verify token hasn't expired

## 📝 Scripts

```bash
npm run dev       # Start development server with hot reload
npm run build     # Compile TypeScript to JavaScript
npm start         # Start production server
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
npm test          # Run tests
```

## 🚀 Deployment

### Heroku

```bash
heroku create budgetflow-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-atlas-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

### AWS/Digital Ocean

1. Set up Node.js environment
2. Install dependencies
3. Build the project
4. Set environment variables
5. Start with PM2: `pm2 start dist/server.js`

## 👨‍💻 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Write clear, descriptive variable names
- Add comments for complex logic
- Use async/await over promises

### Git Workflow

```bash
git checkout -b feature/your-feature-name
# Make changes
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read contributing guidelines first.

## 📧 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

Built with ❤️ using Node.js, TypeScript, Express, and MongoDB