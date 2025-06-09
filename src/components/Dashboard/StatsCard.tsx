import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'emerald' | 'blue' | 'yellow' | 'red';
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, change }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    red: 'bg-red-500 text-white'
  };

  const bgColorClasses = {
    emerald: 'bg-emerald-50',
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50'
  };

  return (
    <div className={`card ${bgColorClasses[color]} border-none`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <i className={`fas ${change.type === 'increase' ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs ml-1 ${change.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}></i>
              <span className={`text-xs font-medium ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change.value}
              </span>
              <span className="text-xs text-gray-500 mr-1">من الشهر الماضي</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;