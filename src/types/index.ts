export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  group: string;
  institution: string;
  supervisor: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  completedHours: number;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  city: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface FilterState {
  search: string;
  specialty: string;
  group: string;
  institution: string;
  city: string;
  status: string;
  supervisor: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  field: keyof Student | '';
  direction: 'asc' | 'desc';
}