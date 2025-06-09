import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { specialties, groups, institutions, cities, supervisors } from '../../data/mockData';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  student?: Student | null;
}

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    group: '',
    institution: '',
    supervisor: '',
    startDate: '',
    endDate: '',
    totalHours: 0,
    completedHours: 0,
    status: 'pending' as Student['status'],
    city: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        specialty: student.specialty,
        group: student.group,
        institution: student.institution,
        supervisor: student.supervisor,
        startDate: student.startDate,
        endDate: student.endDate,
        totalHours: student.totalHours,
        completedHours: student.completedHours,
        status: student.status,
        city: student.city,
        notes: student.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialty: '',
        group: '',
        institution: '',
        supervisor: '',
        startDate: '',
        endDate: '',
        totalHours: 0,
        completedHours: 0,
        status: 'pending',
        city: '',
        notes: ''
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.specialty) newErrors.specialty = 'التخصص مطلوب';
    if (!formData.group) newErrors.group = 'المجموعة مطلوبة';
    if (!formData.institution) newErrors.institution = 'المؤسسة مطلوبة';
    if (!formData.supervisor) newErrors.supervisor = 'المشرف مطلوب';
    if (!formData.startDate) newErrors.startDate = 'تاريخ البداية مطلوب';
    if (!formData.endDate) newErrors.endDate = 'تاريخ النهاية مطلوب';
    if (!formData.city) newErrors.city = 'المدينة مطلوبة';
    if (formData.totalHours <= 0) newErrors.totalHours = 'عدد الساعات يجب أن يكون أكبر من صفر';
    if (formData.completedHours < 0) newErrors.completedHours = 'الساعات المكتملة لا يمكن أن تكون سالبة';
    if (formData.completedHours > formData.totalHours) {
      newErrors.completedHours = 'الساعات المكتملة لا يمكن أن تتجاوز العدد الكلي';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    // Date validation
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalHours' || name === 'completedHours' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {student ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">المعلومات الشخصية</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="name"
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل الاسم الكامل"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+213 555 123 456"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة *
                </label>
                <select
                  name="city"
                  className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                  value={formData.city}
                  onChange={handleChange}
                >
                  <option value="">اختر المدينة</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">المعلومات الأكاديمية</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصص *
                </label>
                <select
                  name="specialty"
                  className={`input-field ${errors.specialty ? 'border-red-500' : ''}`}
                  value={formData.specialty}
                  onChange={handleChange}
                >
                  <option value="">اختر التخصص</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
                {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المجموعة *
                </label>
                <select
                  name="group"
                  className={`input-field ${errors.group ? 'border-red-500' : ''}`}
                  value={formData.group}
                  onChange={handleChange}
                >
                  <option value="">اختر المجموعة</option>
                  {groups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                {errors.group && <p className="text-red-500 text-xs mt-1">{errors.group}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المؤسسة *
                </label>
                <select
                  name="institution"
                  className={`input-field ${errors.institution ? 'border-red-500' : ''}`}
                  value={formData.institution}
                  onChange={handleChange}
                >
                  <option value="">اختر المؤسسة</option>
                  {institutions.map((institution) => (
                    <option key={institution} value={institution}>{institution}</option>
                  ))}
                </select>
                {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المشرف *
                </label>
                <select
                  name="supervisor"
                  className={`input-field ${errors.supervisor ? 'border-red-500' : ''}`}
                  value={formData.supervisor}
                  onChange={handleChange}
                >
                  <option value="">اختر المشرف</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor} value={supervisor}>{supervisor}</option>
                  ))}
                </select>
                {errors.supervisor && <p className="text-red-500 text-xs mt-1">{errors.supervisor}</p>}
              </div>
            </div>

            {/* Training Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">معلومات التدريب</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ البداية *
                </label>
                <input
                  type="date"
                  name="startDate"
                  className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
                  value={formData.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ النهاية *
                </label>
                <input
                  type="date"
                  name="endDate"
                  className={`input-field ${errors.endDate ? 'border-red-500' : ''}`}
                  value={formData.endDate}
                  onChange={handleChange}
                />
                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إجمالي الساعات *
                </label>
                <input
                  type="number"
                  name="totalHours"
                  min="1"
                  className={`input-field ${errors.totalHours ? 'border-red-500' : ''}`}
                  value={formData.totalHours}
                  onChange={handleChange}
                  placeholder="240"
                />
                {errors.totalHours && <p className="text-red-500 text-xs mt-1">{errors.totalHours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الساعات المكتملة
                </label>
                <input
                  type="number"
                  name="completedHours"
                  min="0"
                  className={`input-field ${errors.completedHours ? 'border-red-500' : ''}`}
                  value={formData.completedHours}
                  onChange={handleChange}
                  placeholder="0"
                />
                {errors.completedHours && <p className="text-red-500 text-xs mt-1">{errors.completedHours}</p>}
              </div>
            </div>

            {/* Status and Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">الحالة والملاحظات</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة التدريب
                </label>
                <select
                  name="status"
                  className="input-field"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">في الانتظار</option>
                  <option value="active">نشط</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  className="input-field resize-none"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="أضف أي ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <i className="fas fa-save ml-2"></i>
              {student ? 'تحديث البيانات' : 'إضافة الطالب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;