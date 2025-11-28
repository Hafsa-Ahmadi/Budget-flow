# 📦 BudgetFlow Installation Guide

Complete step-by-step installation instructions for setting up BudgetFlow on your local machine.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Project Setup](#project-setup)
4. [Database Configuration](#database-configuration)
5. [Running the Application](#running-the-application)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## 🖥️ System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB free space
- **Internet Connection**: Required for package installation

## 📥 Prerequisites Installation

### 1. Install Node.js and npm

#### macOS

```bash
# Using Homebrew
brew install node

# Verify installation
node --version  # Should show v18.0.0 or higher
npm --version   # Should show v9.0.0 or higher
```

#### Windows

1. Download Node.js installer from https://nodejs.org/
2. Run the installer (choose LTS version)
3. Open Command Prompt and verify:

```cmd
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install MongoDB

#### macOS

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongosh
```

#### Windows

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service
5. Open Command Prompt and verify:

```cmd
mongosh
```

#### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

### 3. Install Git (if not already installed)

#### macOS

```bash
brew install git
```

#### Windows

Download and install from https://git-scm.com/download/win

#### Linux

```bash
sudo apt-get install git
```

## 🚀 Project Setup

### Step 1: Clone the Repository

```bash
# Clone the project
git clone <repository-url>
cd budgetflow

# Or if you have a zip file
unzip budgetflow.zip
cd budgetflow
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (this may take 2-3 minutes)
npm install

# Create environment file
cp .env.example .env
```

### Step 3: Configure Backend Environment

Open `backend/.env` in a text editor and update:

```env
PORT=5000
NODE_ENV=development

# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/budgetflow

# Generate a secure random string for JWT_SECRET (minimum 32 characters)
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Important**: Replace `your_super_secret_jwt_key_change_this_in_production_min_32_chars` with a secure random string.

To generate a secure JWT secret:

```bash
# On macOS/Linux
openssl rand -hex 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies (this may take 2-3 minutes)
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## 🗄️ Database Configuration

### Option A: Local MongoDB (Recommended for Development)

If you installed MongoDB locally in the prerequisites:

```bash
# MongoDB should already be running
# Verify by connecting
mongosh

# In MongoDB shell, create database
use budgetflow

# Exit MongoDB shell
exit
```

The application will automatically create collections when you start using it.

### Option B: MongoDB Atlas (Cloud Database)

If you prefer to use MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `MONGODB_URI` in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/budgetflow?retryWrites=true&w=majority
```

Replace `username` and `password` with your MongoDB Atlas credentials.

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
# From backend directory
cd backend
npm run dev
```

You should see:

```
╔════════════════════════════════════════╗
║   🚀 BudgetFlow API Server Running    ║
╠════════════════════════════════════════╣
║   Port: 5000                           ║
║   Environment: development             ║
║   URL: http://localhost:5000           ║
╚════════════════════════════════════════╝

✅ MongoDB Connected: localhost:27017
```

### Terminal 2: Start Frontend Application

```bash
# From frontend directory (open a new terminal)
cd frontend
npm run dev
```

The browser should automatically open at `http://localhost:3000`

## ✅ Verification

### 1. Test Backend API

Open your browser or use curl:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-25T10:30:00.000Z"
}
```

### 2. Test Frontend

1. Open `http://localhost:3000` in your browser
2. You should see the BudgetFlow login page
3. Click "Register" to create an account

### 3. Create Test Account

1. Click "Register"
2. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. You should be logged in and see the dashboard

### 4. Test Core Functionality

#### Add an Expense

1. Click "Add Expense" button
2. Fill in:
   - Description: Test Expense
   - Amount: 100
   - Category: Food
   - Select yourself in "Split Between"
3. Click "Add Expense"
4. Expense should appear in the list

#### Set a Budget

1. Go to Dashboard
2. Find a category (e.g., Food)
3. Set a limit (e.g., 5000)
4. Budget progress bar should update

## 🐛 Troubleshooting

### Problem: Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:

```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Problem: MongoDB Connection Failed

**Error**: `Error connecting to MongoDB`

**Solution 1 - Check if MongoDB is running**:

```bash
# macOS
brew services list

# If not running, start it
brew services start mongodb-community

# Linux
sudo systemctl status mongod
sudo systemctl start mongod

# Windows
# Open Services app and start MongoDB service
```

**Solution 2 - Check MongoDB URI**:

Ensure `MONGODB_URI` in `backend/.env` is correct:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/budgetflow

# Check MongoDB is accessible
mongosh mongodb://localhost:27017
```

### Problem: Cannot Connect to Backend

**Error**: Frontend shows "Network Error"

**Solution**:

1. Verify backend is running on port 5000
2. Check `REACT_APP_API_URL` in `frontend/.env`
3. Ensure no firewall blocking
4. Try accessing http://localhost:5000/health directly

### Problem: npm install Fails

**Error**: Various npm errors during installation

**Solution**:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

### Problem: TypeScript Errors

**Error**: TypeScript compilation errors

**Solution**:

```bash
# Reinstall TypeScript
npm install typescript@latest --save-dev

# Clear TypeScript cache
rm -rf node_modules/.cache

# Rebuild
npm run build
```

### Problem: JWT Token Errors

**Error**: "Invalid token" or "Token expired"

**Solution**:

1. Clear browser localStorage:
   - Open Developer Tools (F12)
   - Go to Application/Storage → Local Storage
   - Clear all data
2. Logout and login again
3. Check JWT_SECRET is set in backend/.env

### Problem: Database Collections Not Created

**Solution**:

Collections are created automatically when you add data. If you want to verify:

```bash
mongosh
use budgetflow
show collections
```

## 🔄 Resetting the Application

If you want to start fresh:

### Reset Database

```bash
mongosh
use budgetflow
db.dropDatabase()
exit
```

### Clear Frontend Storage

1. Open Developer Tools (F12)
2. Application/Storage → Local Storage
3. Clear all
4. Refresh page

### Restart Servers

```bash
# Stop both servers (Ctrl+C in each terminal)

# Restart backend
cd backend
npm run dev

# Restart frontend
cd frontend
npm run dev
```

## 📚 Additional Commands

### Backend Commands

```bash
npm run dev       # Start development server
npm run build     # Build TypeScript to JavaScript
npm start         # Start production server
npm run lint      # Check code quality
npm run format    # Format code
```

### Frontend Commands

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm test          # Run tests
npm run lint      # Check code quality
```

## 🎯 Next Steps

After successful installation:

1. Read the main [README.md](README.md) for feature documentation
2. Check [backend/README.md](backend/README.md) for API details
3. Check [frontend/README.md](frontend/README.md) for UI customization
4. Explore the application features
5. Try creating multiple users to test expense splitting

## 💡 Tips

1. **Keep terminals open**: You need both backend and frontend running
2. **Use separate terminals**: Don't run both in the same terminal
3. **Check logs**: Terminal output shows errors and requests
4. **Use browser DevTools**: F12 to see network requests and errors
5. **Hot reload**: Both frontend and backend support auto-reload on code changes

## 📞 Getting Help

If you encounter issues:

1. Check the terminal output for error messages
2. Review this troubleshooting section
3. Check if all prerequisites are installed correctly
4. Verify MongoDB is running
5. Ensure ports 3000 and 5000 are available
6. Open a GitHub issue with details of the problem

---

Happy coding! 🚀