import React, { useState, useMemo } from 'react';
import { useStudents } from '../contexts/StudentsContext';
import StudentsTable from '../components/Students/StudentsTable';
import StudentsFilters from '../components/Students/StudentsFilters';
import StudentModal from '../components/Students/StudentModal';
import Pagination from '../components/Common/Pagination';
import { Student } from '../types';

const StudentsManagement: React.FC = () => {
  const {
    filteredStudents,
    filters,
    pagination,
    sort,
    loading,
    setFilters,
    setPagination,
    setSort,
    addStudent,
    updateStudent,
    deleteStudent,
    exportToPDF,
    exportToCSV
  } = useStudents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Paginated students
  const paginatedStudents = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filtere dStudents.slice(startIndex, endIndex);
  }, [filteredStudents, pagination.page, pagination.pageSize]);

  const totalPages = Math.ceil(filteredStudents.length / pagination.pageSize);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    setShowDeleteConfirm(studentId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteStudent(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleSort = (field: keyof Student) => {
    if (sort.field === field) {
      setSort({ direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, direction: 'asc' });
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      specialty: '',
      group: '',
      institution: '',
      city: '',
      status: '',
      supervisor: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلاب</h1>
          <p className="text-gray-600 mt-1">
            إدارة شاملة لبيانات الطلاب المتدربين ({filteredStudents.length} من {filteredStudents.length})
          </p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={exportToCSV}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? (
              <div className="spinner ml-2"></div>
            ) : (
              <i className="fas fa-file-csv ml-2"></i>
            )}
            تصدير CSV
          </button>
          <button
            onClick={exportToPDF}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? (
              <div className="spinner ml-2"></div>
            ) : (
              <i className="fas fa-file-pdf ml-2"></i>
            )}
            تصدير PDF
          </button>
          <button
            onClick={handleAddStudent}
            className="btn-primary"
          >
            <i className="fas fa-plus ml-2"></i>
            إضافة طالب جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <StudentsFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <div className="card p-0">
        <StudentsTable
          students={paginatedStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onSort={handleSort}
          sortField={sort.field}
          sortDirection={sort.direction}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={(page) => setPagination({ page })}
            itemsPerPage={pagination.pageSize}
            totalItems={filteredStudents.length}
          />
        )}
      </div>

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        student={editingStudent}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center ml-4">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">تأكيد الحذف</h3>
                  <p className="text-gray-600 mt-1">هل أنت متأكد من حذف هذا الطالب؟</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بيانات الطالب نهائياً.
              </p>
              <div className="flex items-center justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="btn-secondary"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn-danger"
                >
                  <i className="fas fa-trash ml-2"></i>
                  حذف نهائي
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;