import React from 'react';
import { DollarSign } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface HeaderProps {
  currentUser: User;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">BudgetFlow</h1>
              <p className="text-sm text-gray-600">Track & Split Expenses</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-semibold">{currentUser.name}</div>
              <div className="text-sm text-gray-600">{currentUser.email}</div>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;