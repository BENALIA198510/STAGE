import React from 'react';
import { FilterState } from '../../types';
import { specialties, groups, institutions, cities, supervisors } from '../../data/mockData';

interface StudentsFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
}

const StudentsFilters: React.FC<StudentsFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const handleChange = (field: keyof FilterState, value: string) => {
    onFiltersChange({ [field]: value });
  };

  const statusOptions = [
    { value: '', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'cancelled', label: 'ملغي' }
  ];

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">الفلاتر والبحث</h3>
        <button
          onClick={onReset}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          <i className="fas fa-undo ml-1"></i>
          إعادة تعيين
        </button>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            البحث
          </label>
          <div className="relative">
            <input
              type="text"
              className="input-field pr-10"
              placeholder="ابحث بالاسم، البريد الإلكتروني، أو الهاتف..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التخصص
            </label>
            <select
              className="input-field"
              value={filters.specialty}
              onChange={(e) => handleChange('specialty', e.target.value)}
            >
              <option value="">جميع التخصصات</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المجموعة
            </label>
            <select
              className="input-field"
              value={filters.group}
              onChange={(e) => handleChange('group', e.target.value)}
            >
              <option value="">جميع المجموعات</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المؤسسة
            </label>
            <select
              className="input-field"
              value={filters.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
            >
              <option value="">جميع المؤسسات</option>
              {institutions.map((institution) => (
                <option key={institution} value={institution}>
                  {institution}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المدينة
            </label>
            <select
              className="input-field"
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
            >
              <option value="">جميع المدن</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة
            </label>
            <select
              className="input-field"
              value={filters.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Supervisor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المشرف
            </label>
            <select
              className="input-field"
              value={filters.supervisor}
              onChange={(e) => handleChange('supervisor', e.target.value)}
            >
              <option value="">جميع المشرفين</option>
              {supervisors.map((supervisor) => (
                <option key={supervisor} value={supervisor}>
                  {supervisor}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsFilters;