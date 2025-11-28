import React from 'react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paidBy: string;
  splitBetween: string[];
  settled: boolean;
}

interface ExpenseCardProps {
  expense: Expense;
  currentUserId: string;
  getUserName: (userId: string) => string;
  onSettle?: (expenseId: string) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, currentUserId, getUserName, onSettle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
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
        <div className="text-right ml-4">
          <div className="text-2xl font-bold">₹{expense.amount}</div>
          <div className="text-sm text-gray-600">
            Per person: ₹{(expense.amount / expense.splitBetween.length).toFixed(2)}
          </div>
          {!expense.settled && expense.paidBy === currentUserId && onSettle && (
            <button
              onClick={() => onSettle(expense.id)}
              className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
            >
              Mark Settled
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;