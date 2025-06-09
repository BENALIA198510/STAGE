import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, FilterState, PaginationState, SortState } from '../types';
import { mockStudents } from '../data/mockData';

interface StudentsContextType {
  students: Student[];
  filteredStudents: Student[];
  filters: FilterState;
  pagination: PaginationState;
  sort: SortState;
  loading: boolean;
  setFilters: (filters: Partial<FilterState>) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  setSort: (sort: Partial<SortState>) => void;
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  exportToPDF: () => void;
  exportToCSV: () => void;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }
  return context;
};

interface StudentsProviderProps {
  children: ReactNode;
}

export const StudentsProvider: React.FC<StudentsProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [filters, setFiltersState] = useState<FilterState>({
    search: '',
    specialty: '',
    group: '',
    institution: '',
    city: '',
    status: '',
    supervisor: ''
  });
  const [pagination, setPaginationState] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0
  });
  const [sort, setSortState] = useState<SortState>({
    field: '',
    direction: 'asc'
  });
  const [loading, setLoading] = useState(false);

  // Filter and sort students
  const filteredStudents = React.useMemo(() => {
    let filtered = students.filter(student => {
      const searchMatch = !filters.search || 
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.phone.includes(filters.search);
      
      const specialtyMatch = !filters.specialty || student.specialty === filters.specialty;
      const groupMatch = !filters.group || student.group === filters.group;
      const institutionMatch = !filters.institution || student.institution === filters.institution;
      const cityMatch = !filters.city || student.city === filters.city;
      const statusMatch = !filters.status || student.status === filters.status;
      const supervisorMatch = !filters.supervisor || student.supervisor === filters.supervisor;

      return searchMatch && specialtyMatch && groupMatch && institutionMatch && 
             cityMatch && statusMatch && supervisorMatch;
    });

    // Apply sorting
    if (sort.field) {
      filtered.sort((a, b) => {
        const aValue = a[sort.field as keyof Student];
        const bValue = b[sort.field as keyof Student];
        
        if (sort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [students, filters, sort]);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPaginationState(prev => ({ ...prev, page: 1 }));
  };

  const setPagination = (newPagination: Partial<PaginationState>) => {
    setPaginationState(prev => ({ ...prev, ...newPagination }));
  };

  const setSort = (newSort: Partial<SortState>) => {
    setSortState(prev => ({ ...prev, ...newSort }));
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id 
        ? { ...student, ...studentData, updatedAt: new Date().toISOString() }
        : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      // Dynamic import to avoid bundling issues
      const jsPDF = (await import('jspdf')).default;
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add Arabic font support (this is a simplified example)
      doc.setFont('helvetica');
      doc.setFontSize(16);
      doc.text('StageFlow - تقرير الطلاب المتدربين', 20, 20);
      
      const tableData = filteredStudents.map(student => [
        student.name,
        student.specialty,
        student.institution,
        student.supervisor,
        student.status === 'active' ? 'نشط' : 
        student.status === 'completed' ? 'مكتمل' : 
        student.status === 'pending' ? 'في الانتظار' : 'ملغي',
        `${student.completedHours}/${student.totalHours}`
      ]);

      (doc as any).autoTable({
        head: [['الاسم', 'التخصص', 'المؤسسة', 'المشرف', 'الحالة', 'الساعات']],
        body: tableData,
        startY: 40,
        styles: { 
          font: 'helvetica',
          fontSize: 10,
          halign: 'right'
        },
        headStyles: { 
          fillColor: [34, 197, 94],
          textColor: 255
        }
      });

      doc.save('stageflow-students-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    setLoading(true);
    try {
      const headers = ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'التخصص', 'المجموعة', 'المؤسسة', 'المشرف', 'تاريخ البداية', 'تاريخ النهاية', 'الساعات الكلية', 'الساعات المكتملة', 'الحالة', 'المدينة', 'ملاحظات'];
      
      const csvContent = [
        headers.join(','),
        ...filteredStudents.map(student => [
          student.name,
          student.email,
          student.phone,
          student.specialty,
          student.group,
          student.institution,
          student.supervisor,
          student.startDate,
          student.endDate,
          student.totalHours,
          student.completedHours,
          student.status === 'active' ? 'نشط' : 
          student.status === 'completed' ? 'مكتمل' : 
          student.status === 'pending' ? 'في الانتظار' : 'ملغي',
          student.city,
          student.notes || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'stageflow-students-report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: StudentsContextType = {
    students,
    filteredStudents,
    filters,
    pagination: { ...pagination, total: filteredStudents.length },
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
  };

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
};