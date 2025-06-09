import React from 'react';
import { Student } from '../../types';

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onSort: (field: keyof Student) => void;
  sortField: keyof Student | '';
  sortDirection: 'asc' | 'desc';
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortDirection
}) => {
  const getStatusBadge = (status: Student['status']) => {
    const badges = {
      active: 'badge badge-success',
      completed: 'badge badge-info',
      pending: 'badge badge-warning',
      cancelled: 'badge badge-danger'
    };

    const labels = {
      active: 'نشط',
      completed: 'مكتمل',
      pending: 'في الانتظار',
      cancelled: 'ملغي'
    };

    return (
      <span className={badges[status]}>
        {labels[status]}
      </span>
    );
  };

  const getProgress = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    return {
      percentage,
      color: percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
    };
  };

  const SortButton: React.FC<{ field: keyof Student; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 space-x-reverse hover:text-gray-900 transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        <i className={`fas ${sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'} text-xs`}></i>
      )}
      {sortField !== field && (
        <i className="fas fa-sort text-xs opacity-50"></i>
      )}
    </button>
  );

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th>
              <SortButton field="name">الاسم</SortButton>
            </th>
            <th>
              <SortButton field="specialty">التخصص</SortButton>
            </th>
            <th>
              <SortButton field="institution">المؤسسة</SortButton>
            </th>
            <th>
              <SortButton field="supervisor">المشرف</SortButton>
            </th>
            <th>
              <SortButton field="status">الحالة</SortButton>
            </th>
            <th>التقدم</th>
            <th>
              <SortButton field="startDate">تاريخ البداية</SortButton>
            </th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {students.map((student) => {
            const progress = getProgress(student.completedHours, student.totalHours);
            return (
              <tr key={student.id} className="hover:bg-gray-50">
                <td>
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                </td>
                <td>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{student.specialty}</div>
                    <div className="text-sm text-gray-500">{student.group}</div>
                  </div>
                </td>
                <td>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{student.institution}</div>
                    <div className="text-sm text-gray-500">{student.city}</div>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-900">{student.supervisor}</div>
                </td>
                <td>
                  {getStatusBadge(student.status)}
                </td>
                <td>
                  <div className="w-24">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>{student.completedHours}</span>
                      <span>{student.totalHours}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${progress.color} transition-all duration-300`}
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      {Math.round(progress.percentage)}%
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-900">
                    {new Date(student.startDate).toLocaleDateString('ar-SA')}
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => onEdit(student)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                      title="تعديل"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="حذف"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {students.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بيانات</h3>
          <p className="text-gray-500">لم يتم العثور على طلاب مطابقين للفلاتر المحددة</p>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;