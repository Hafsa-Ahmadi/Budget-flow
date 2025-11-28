import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white opacity-90">{title}</span>
        <Icon size={24} />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-white opacity-80 mt-1">{subtitle}</div>
    </div>
  );
};

export default StatsCard;