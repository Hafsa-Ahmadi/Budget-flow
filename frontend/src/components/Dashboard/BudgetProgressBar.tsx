import React from 'react';

interface BudgetProgressBarProps {
  category: string;
  spent: number;
  limit: number;
  color: string;
}

const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({ category, spent, limit, color }) => {
  const percentage = (spent / limit) * 100;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{category}</span>
        <span className="text-sm text-gray-600">
          ₹{spent.toFixed(0)} / ₹{limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: percentage > 90 ? '#ef4444' : color
          }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {percentage.toFixed(1)}% used
        {percentage > 90 && <span className="text-red-600 ml-2">⚠ Near limit!</span>}
      </div>
    </div>
  );
};

export default BudgetProgressBar;