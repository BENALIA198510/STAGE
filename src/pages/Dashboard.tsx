import React from 'react';
import { useStudents } from '../contexts/StudentsContext';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import ChartCard from '../components/Dashboard/ChartCard';

const Dashboard: React.FC = () => {
  const { students } = useStudents();

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const completedStudents = students.filter(s => s.status === 'completed').length;
  const totalHours = students.reduce((sum, s) => sum + s.totalHours, 0);
  const completedHours = students.reduce((sum, s) => sum + s.completedHours, 0);
  const institutions = new Set(students.map(s => s.institution)).size;

  const progressPercentage = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في نظام إدارة التدريب العملي - StageFlow</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي الطلاب"
          value={totalStudents}
          icon="fas fa-users"
          color="emerald"
          change={{ value: '+12%', type: 'increase' }}
        />
        <StatsCard
          title="الطلاب النشطون"
          value={activeStudents}
          icon="fas fa-user-clock"
          color="blue"
          change={{ value: '+8%', type: 'increase' }}
        />
        <StatsCard
          title="التدريب المكتمل"
          value={completedStudents}
          icon="fas fa-user-check"
          color="yellow"
          change={{ value: '+15%', type: 'increase' }}
        />
        <StatsCard
          title="المؤسسات"
          value={institutions}
          icon="fas fa-building"
          color="red"
          change={{ value: '+3%', type: 'increase' }}
        />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">نظرة عامة على التقدم</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">إجمالي الساعات</span>
                <span className="text-lg font-bold text-gray-900">{totalHours.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">الساعات المكتملة</span>
                <span className="text-lg font-bold text-emerald-600">{completedHours.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">الساعات المتبقية</span>
                <span className="text-lg font-bold text-blue-600">{(totalHours - completedHours).toLocaleString()}</span>
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">التقدم الإجمالي</span>
                  <span className="text-sm font-bold text-gray-900">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الحالات</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                  <span className="text-sm text-gray-700">نشط</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{activeStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full ml-2"></div>
                  <span className="text-sm text-gray-700">مكتمل</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{completedStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></div>
                  <span className="text-sm text-gray-700">في الانتظار</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {students.filter(s => s.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
                  <span className="text-sm text-gray-700">ملغي</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {students.filter(s => s.status === 'cancelled').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard />
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors text-right">
            <i className="fas fa-user-plus text-emerald-600 text-xl mb-2"></i>
            <h4 className="font-medium text-gray-900">إضافة طالب جديد</h4>
            <p className="text-sm text-gray-600 mt-1">سجل طالب جديد في النظام</p>
          </button>
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-right">
            <i className="fas fa-file-export text-blue-600 text-xl mb-2"></i>
            <h4 className="font-medium text-gray-900">تصدير التقارير</h4>
            <p className="text-sm text-gray-600 mt-1">صدر البيانات إلى PDF أو CSV</p>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-right">
            <i className="fas fa-chart-bar text-yellow-600 text-xl mb-2"></i>
            <h4 className="font-medium text-gray-900">عرض الإحصائيات</h4>
            <p className="text-sm text-gray-600 mt-1">تحليل شامل لبيانات التدريب</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;