import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StudentsProvider } from './contexts/StudentsContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import StudentsManagement from './pages/StudentsManagement';
import LoadingSpinner from './components/Common/LoadingSpinner';

type AuthMode = 'login' | 'register' | 'forgot';

const AuthWrapper: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg\" text="جارٍ تحميل النظام..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (authMode) {
      case 'register':
        return <RegisterForm onToggleMode={setAuthMode} />;
      case 'forgot':
        return <ForgotPasswordForm onToggleMode={setAuthMode} />;
      default:
        return <LoginForm onToggleMode={setAuthMode} />;
    }
  }

  return <MainApp />;
};

const MainApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'students':
        return <StudentsManagement />;
      case 'reports':
        return (
          <div className="text-center py-12">
            <i className="fas fa-chart-bar text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">التقارير</h2>
            <p className="text-gray-600">قريباً - صفحة التقارير المفصلة</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <i className="fas fa-cog text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">الإعدادات</h2>
            <p className="text-gray-600">قريباً - صفحة إعدادات النظام</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StudentsProvider>
        <AuthWrapper />
      </StudentsProvider>
    </AuthProvider>
  );
};

export default App;