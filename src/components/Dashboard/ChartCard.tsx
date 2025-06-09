import React from 'react';

const ChartCard: React.FC = () => {
  const data = [
    { month: 'يناير', students: 45 },
    { month: 'فبراير', students: 52 },
    { month: 'مارس', students: 48 },
    { month: 'أبريل', students: 61 },
    { month: 'مايو', students: 55 },
    { month: 'يونيو', students: 67 }
  ];

  const maxValue = Math.max(...data.map(item => item.students));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">الطلاب المسجلين شهرياً</h3>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full ml-2"></div>
            <span className="text-sm text-gray-600">الطلاب</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 w-16">{item.month}</span>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.students / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900 w-8 text-left">{item.students}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">المجموع:</span>
          <span className="font-semibold text-gray-900">
            {data.reduce((sum, item) => sum + item.students, 0)} طالب
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;