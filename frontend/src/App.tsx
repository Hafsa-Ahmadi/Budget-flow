import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Users, Calendar, PieChart, Download, Upload, Settings, LogOut, Home, CreditCard, Receipt } from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paidBy: string;
  splitBetween: string[];
  receipt?: string;
  settled: boolean;
}

interface Budget {
  category: string;
  limit: number;
  spent: number;
  color: string;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

const BudgetFlow = () => {
  // State Management
  const [currentUser] = useState<User>({
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com'
  });

  const [users] = useState<User[]>([
    { id: 'user1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'user3', name: 'Bob Wilson', email: 'bob@example.com' },
    { id: 'user4', name: 'Alice Brown', email: 'alice@example.com' }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      description: 'Team Dinner',
      amount: 2400,
      category: 'Food',
      date: '2025-11-20',
      paidBy: 'user1',
      splitBetween: ['user1', 'user2', 'user3', 'user4'],
      settled: false
    },
    {
      id: '2',
      description: 'Office Supplies',
      amount: 800,
      category: 'Shopping',
      date: '2025-11-22',
      paidBy: 'user2',
      splitBetween: ['user1', 'user2'],
      settled: false
    },
    {
      id: '3',
      description: 'Uber Ride',
      amount: 350,
      category: 'Transport',
      date: '2025-11-23',
      paidBy: 'user1',
      splitBetween: ['user1', 'user3'],
      settled: true
    },
    {
      id: '4',
      description: 'Movie Tickets',
      amount: 1200,
      category: 'Entertainment',
      date: '2025-11-24',
      paidBy: 'user3',
      splitBetween: ['user1', 'user2', 'user3', 'user4'],
      settled: false
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food', limit: 5000, spent: 600, color: '#22c55e' },
    { category: 'Transport', limit: 3000, spent: 175, color: '#3b82f6' },
    { category: 'Shopping', limit: 4000, spent: 400, color: '#f59e0b' },
    { category: 'Entertainment', limit: 2000, spent: 300, color: '#ec4899' },
    { category: 'Bills', limit: 8000, spent: 0, color: '#8b5cf6' }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    paidBy: currentUser.id,
    splitBetween: [currentUser.id]
  });

  // Calculate settlements
  const calculateSettlements = (): Settlement[] => {
    const balances: { [key: string]: number } = {};
    
    users.forEach(user => {
      balances[user.id] = 0;
    });

    expenses.filter(e => !e.settled).forEach(expense => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      
      balances[expense.paidBy] += expense.amount;
      
      expense.splitBetween.forEach(userId => {
        balances[userId] -= splitAmount;
      });
    });

    const settlements: Settlement[] = [];
    const creditors = Object.entries(balances).filter(([_, amt]) => amt > 0.01).sort((a, b) => b[1] - a[1]);
    const debtors = Object.entries(balances).filter(([_, amt]) => amt < -0.01).sort((a, b) => a[1] - b[1]);

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const [creditorId, creditAmt] = creditors[i];
      const [debtorId, debtAmt] = debtors[j];
      
      const settleAmt = Math.min(creditAmt, -debtAmt);
      
      if (settleAmt > 0.01) {
        settlements.push({
          from: debtorId,
          to: creditorId,
          amount: settleAmt
        });
      }

      creditors[i][1] -= settleAmt;
      debtors[j][1] += settleAmt;

      if (creditors[i][1] < 0.01) i++;
      if (debtors[j][1] > -0.01) j++;
    }

    return settlements;
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      paidBy: newExpense.paidBy,
      splitBetween: newExpense.splitBetween,
      settled: false
    };

    setExpenses([expense, ...expenses]);
    
    setBudgets(budgets.map(b => 
      b.category === expense.category 
        ? { ...b, spent: b.spent + (expense.amount / expense.splitBetween.length) }
        : b
    ));

    setNewExpense({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      paidBy: currentUser.id,
      splitBetween: [currentUser.id]
    });
    
    setShowAddExpense(false);
  };

  const toggleSplitUser = (userId: string) => {
    setNewExpense(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(userId)
        ? prev.splitBetween.filter(id => id !== userId)
        : [...prev.splitBetween, userId]
    }));
  };

  const settleExpense = (expenseId: string) => {
    setExpenses(expenses.map(e => 
      e.id === expenseId ? { ...e, settled: true } : e
    ));
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown';
  };

  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount / e.splitBetween.length), 0);
  const thisMonthExpenses = expenses.filter(e => {
    const expDate = new Date(e.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });
  const thisMonthSpent = thisMonthExpenses.reduce((sum, e) => sum + (e.amount / e.splitBetween.length), 0);

  const settlements = calculateSettlements();

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Total Spent</span>
            <DollarSign size={24} />
          </div>
          <div className="text-3xl font-bold">₹{totalSpent.toFixed(2)}</div>
          <div className="text-sm text-blue-100 mt-1">{expenses.length} transactions</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">This Month</span>
            <TrendingUp size={24} />
          </div>
          <div className="text-3xl font-bold">₹{thisMonthSpent.toFixed(2)}</div>
          <div className="text-sm text-green-100 mt-1">{thisMonthExpenses.length} expenses</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">Pending Settlements</span>
            <Users size={24} />
          </div>
          <div className="text-3xl font-bold">{settlements.length}</div>
          <div className="text-sm text-purple-100 mt-1">to be settled</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
        <div className="space-y-4">
          {budgets.map((budget, idx) => {
            const percentage = (budget.spent / budget.limit) * 100;
            return (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{budget.category}</span>
                  <span className="text-sm text-gray-600">
                    ₹{budget.spent.toFixed(0)} / ₹{budget.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: percentage > 90 ? '#ef4444' : budget.color
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {percentage.toFixed(1)}% used
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
        <div className="space-y-3">
          {expenses.slice(0, 5).map(expense => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-gray-600">
                  {expense.category} • {new Date(expense.date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Paid by {getUserName(expense.paidBy)} • Split {expense.splitBetween.length} ways
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">₹{expense.amount}</div>
                <div className="text-sm text-gray-600">
                  Your share: ₹{(expense.amount / expense.splitBetween.length).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Expenses View
  const ExpensesView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Expenses</h2>
        <button
          onClick={() => setShowAddExpense(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Add Expense
        </button>
      </div>

      <div className="space-y-3">
        {expenses.map(expense => (
          <div key={expense.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{expense.description}</h3>
                  {expense.settled && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Settled
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {expense.category} • {new Date(expense.date).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    Paid by: {getUserName(expense.paidBy)}
                  </span>
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    Split: {expense.splitBetween.map(id => getUserName(id)).join(', ')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{expense.amount}</div>
                <div className="text-sm text-gray-600">
                  Per person: ₹{(expense.amount / expense.splitBetween.length).toFixed(2)}
                </div>
                {!expense.settled && expense.paidBy === currentUser.id && (
                  <button
                    onClick={() => settleExpense(expense.id)}
                    className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Mark Settled
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Settlements View
  const SettlementsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settlements</h2>
      
      {settlements.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">All settled up! No pending payments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {settlements.map((settlement, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-700 font-semibold">
                      {getUserName(settlement.from).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{getUserName(settlement.from)}</div>
                    <div className="text-sm text-gray-600">owes</div>
                  </div>
                </div>
                
                <div className="text-center px-6">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{settlement.amount.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{getUserName(settlement.to)}</div>
                    <div className="text-sm text-gray-600">gets back</div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold">
                      {getUserName(settlement.to).charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Add Expense Modal
  const AddExpenseModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Add New Expense</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Dinner at restaurant"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (₹)</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {budgets.map(b => (
                  <option key={b.category} value={b.category}>{b.category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Paid By</label>
            <select
              value={newExpense.paidBy}
              onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Split Between</label>
            <div className="grid grid-cols-2 gap-2">
              {users.map(user => (
                <label key={user.id} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={newExpense.splitBetween.includes(user.id)}
                    onChange={() => toggleSplitUser(user.id)}
                    className="w-4 h-4"
                  />
                  <span>{user.name}</span>
                </label>
              ))}
            </div>
            {newExpense.splitBetween.length > 0 && newExpense.amount && (
              <div className="mt-2 text-sm text-gray-600">
                Each person pays: ₹{(parseFloat(newExpense.amount) / newExpense.splitBetween.length).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t flex gap-3">
          <button
            onClick={() => setShowAddExpense(false)}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={addExpense}
            disabled={!newExpense.description || !newExpense.amount || newExpense.splitBetween.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
      {/* Navigation */}
  <nav className="bg-white border-b sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex gap-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'expenses', label: 'Expenses', icon: Receipt },
          { id: 'settlements', label: 'Settlements', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  </nav>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 py-8">
    {activeTab === 'dashboard' && <DashboardView />}
    {activeTab === 'expenses' && <ExpensesView />}
    {activeTab === 'settlements' && <SettlementsView />}
  </main>

  {/* Floating Action Button */}
  {activeTab !== 'expenses' && (
    <button
      onClick={() => setShowAddExpense(true)}
      className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center z-50"
    >
      <PlusCircle size={32} />
    </button>
  )}

  {/* Modals */}
  {showAddExpense && <AddExpenseModal />}
</div>
);
};
export default BudgetFlow;