import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface SettlementCardProps {
  settlement: Settlement;
  getUserName: (userId: string) => string;
}

const SettlementCard: React.FC<SettlementCardProps> = ({ settlement, getUserName }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-700 font-semibold text-lg">
              {getUserName(settlement.from).charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-semibold text-lg">{getUserName(settlement.from)}</div>
            <div className="text-sm text-gray-600">owes</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ArrowRight size={24} className="text-gray-400" />
        </div>

        <div className="text-center px-6">
          <div className="text-3xl font-bold text-blue-600">
            ₹{settlement.amount.toFixed(2)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ArrowRight size={24} className="text-gray-400" />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold text-lg">{getUserName(settlement.to)}</div>
            <div className="text-sm text-gray-600">gets back</div>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-700 font-semibold text-lg">
              {getUserName(settlement.to).charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementCard;