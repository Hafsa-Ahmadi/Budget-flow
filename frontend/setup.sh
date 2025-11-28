#!/bin/bash

# BudgetFlow Quick Setup Script
# This script automates the installation and setup process

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════╗"
echo "║         BudgetFlow - Automated Setup Script           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js >= 18.0.0"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be >= 18.0.0. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "npm $(npm -v) detected"

# Check if MongoDB is installed (optional check)
if command -v mongosh &> /dev/null; then
    print_success "MongoDB detected"
else
    print_warning "MongoDB not detected. You can use MongoDB Atlas instead."
    print_warning "Instructions: https://www.mongodb.com/cloud/atlas"
fi

echo ""
print_status "Starting setup process..."
echo ""

# Backend Setup
print_status "Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found. Are you in the correct directory?"
    exit 1
fi

print_status "Installing backend dependencies..."
npm install

print_success "Backend dependencies installed"

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating backend .env file..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        
        # Generate JWT secret
        JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        
        # Replace JWT_SECRET in .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/your_super_secret_jwt_key_change_this_in_production/$JWT_SECRET/" .env
        else
            # Linux
            sed -i "s/your_super_secret_jwt_key_change_this_in_production/$JWT_SECRET/" .env
        fi
        
        print_success "Backend .env file created with generated JWT_SECRET"
        print_warning "Please review backend/.env and update MONGODB_URI if needed"
    else
        print_error ".env.example not found in backend directory"
        exit 1
    fi
else
    print_success "Backend .env file already exists"
fi

cd ..

# Frontend Setup
print_status "Setting up frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found"
    exit 1
fi

print_status "Installing frontend dependencies..."
npm install

print_success "Frontend dependencies installed"

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating frontend .env file..."
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
    print_success "Frontend .env file created"
else
    print_success "Frontend .env file already exists"
fi

cd ..

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                  Setup Complete! 🎉                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

print_success "Installation completed successfully!"
echo ""

echo "Next steps:"
echo ""
echo "1. ${BLUE}Ensure MongoDB is running${NC}"
echo "   - Local: brew services start mongodb-community (macOS)"
echo "   - Cloud: Use MongoDB Atlas connection string in backend/.env"
echo ""
echo "2. ${BLUE}Start the backend server${NC} (in a new terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. ${BLUE}Start the frontend app${NC} (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. ${BLUE}Open your browser${NC}"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""

print_warning "Don't forget to review and update environment variables if needed:"
echo "   - backend/.env (especially MONGODB_URI)"
echo "   - frontend/.env"
echo ""

print_status "For detailed instructions, see:"
echo "   - README.md"
echo "   - INSTALLATION_GUIDE.md"
echo ""

print_success "Happy coding! 🚀"