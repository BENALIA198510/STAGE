import React from 'react';

interface Activity {
  id: string;
  type: 'student_added' | 'student_completed' | 'student_updated';
  message: string;
  time: string;
  user: string;
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'student_added',
      message: 'تم إضافة طالب جديد: أحمد محمد علي',
      time: 'منذ ساعتين',
      user: 'د. فاطمة بن علي'
    },
    {
      id: '2',
      type: 'student_completed',
      message: 'أكملت سارة خالد حسن التدريب بنجاح',
      time: 'منذ 4 ساعات',
      user: 'د. محمد الأمين'
    },
    {
      id: '3',
      type: 'student_updated',
      message: 'تم تحديث بيانات الطالب: يوسف عبدالله زياد',
      time: 'منذ يوم واحد',
      user: 'د. عائشة بلقاسم'
    },
    {
      id: '4',
      type: 'student_added',
      message: 'تم إضافة طالبة جديدة: لينا صالح نور',
      time: 'منذ يومين',
      user: 'د. كريم بن سعد'
    }
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'student_added':
        return 'fa-user-plus text-green-500';
      case 'student_completed':
        return 'fa-check-circle text-blue-500';
      case 'student_updated':
        return 'fa-edit text-yellow-500';
      default:
        return 'fa-info-circle text-gray-500';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">النشاط الأخير</h3>
        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          عرض الكل
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 space-x-reverse">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <i className={`fas ${getActivityIcon(activity.type)} text-sm`}></i>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{activity.user}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;