import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      icon: 'fas fa-tachometer-alt'
    },
    {
      id: 'students',
      label: 'إدارة الطلاب',
      icon: 'fas fa-users'
    },
    {
      id: 'reports',
      label: 'التقارير',
      icon: 'fas fa-chart-bar'
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: 'fas fa-cog'
    }
  ];

  return (
    <aside className="bg-white shadow-sm border-l border-gray-200 w-64 min-h-screen">
      <nav className="mt-8">
        <div className="px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <i className={`${item.icon} ml-3 text-lg`}></i>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;