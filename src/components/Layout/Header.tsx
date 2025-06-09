import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-emerald-600">
                <i className="fas fa-graduation-cap ml-2"></i>
                StageFlow
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                بساطة إدارة التدريب من الدخول إلى التصدير
              </p>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}
              </p>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={logout}
                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-200"
                title="تسجيل الخروج"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;