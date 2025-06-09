import { Student } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    email: 'ahmed.mohamed@email.com',
    phone: '+213 555 123 456',
    specialty: 'هندسة البرمجيات',
    group: 'المجموعة أ',
    institution: 'جامعة الجزائر',
    supervisor: 'د. فاطمة بن علي',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    totalHours: 240,
    completedHours: 180,
    status: 'active',
    city: 'الجزائر',
    notes: 'طالب متميز يظهر تقدماً ممتازاً',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'سارة خالد حسن',
    email: 'sara.khaled@email.com',
    phone: '+213 555 234 567',
    specialty: 'التسويق الرقمي',
    group: 'المجموعة ب',
    institution: 'جامعة وهران',
    supervisor: 'د. محمد الأمين',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    totalHours: 200,
    completedHours: 200,
    status: 'completed',
    city: 'وهران',
    notes: 'أكملت التدريب بنجاح',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-15'
  },
  {
    id: '3',
    name: 'يوسف عبدالله زياد',
    email: 'youssef.abdullah@email.com',
    phone: '+213 555 345 678',
    specialty: 'إدارة الأعمال',
    group: 'المجموعة ج',
    institution: 'جامعة قسنطينة',
    supervisor: 'د. عائشة بلقاسم',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    totalHours: 220,
    completedHours: 0,
    status: 'pending',
    city: 'قسنطينة',
    notes: 'في انتظار بداية التدريب',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-28'
  },
  {
    id: '4',
    name: 'لينا صالح نور',
    email: 'lina.saleh@email.com',
    phone: '+213 555 456 789',
    specialty: 'التصميم الجرافيكي',
    group: 'المجموعة أ',
    institution: 'جامعة سطيف',
    supervisor: 'د. كريم بن سعد',
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    totalHours: 180,
    completedHours: 120,
    status: 'active',
    city: 'سطيف',
    notes: 'تظهر مهارات إبداعية متميزة',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-10'
  },
  {
    id: '5',
    name: 'عمر رشيد حمدان',
    email: 'omar.rashid@email.com',
    phone: '+213 555 567 890',
    specialty: 'الشبكات والأمن السيبراني',
    group: 'المجموعة ب',
    institution: 'جامعة تلمسان',
    supervisor: 'د. نادية حسني',
    startDate: '2023-12-01',
    endDate: '2024-03-01',
    totalHours: 200,
    completedHours: 50,
    status: 'cancelled',
    city: 'تلمسان',
    notes: 'تم إلغاء التدريب لأسباب شخصية',
    createdAt: '2023-11-25',
    updatedAt: '2024-01-05'
  },
  {
    id: '6',
    name: 'مريم أحمد فؤاد',
    email: 'mariam.ahmed@email.com',
    phone: '+213 555 678 901',
    specialty: 'المحاسبة والمالية',
    group: 'المجموعة ج',
    institution: 'جامعة باتنة',
    supervisor: 'د. سليم بوعلام',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    totalHours: 240,
    completedHours: 160,
    status: 'active',
    city: 'باتنة',
    notes: 'طالبة مجتهدة ودقيقة في العمل',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-01'
  }
];

export const specialties = [
  'هندسة البرمجيات',
  'التسويق الرقمي',
  'إدارة الأعمال',
  'التصميم الجرافيكي',
  'الشبكات والأمن السيبراني',
  'المحاسبة والمالية',
  'الموارد البشرية',
  'إدارة المشاريع'
];

export const groups = [
  'المجموعة أ',
  'المجموعة ب',
  'المجموعة ج',
  'المجموعة د'
];

export const institutions = [
  'جامعة الجزائر',
  'جامعة وهران',
  'جامعة قسنطينة',
  'جامعة سطيف',
  'جامعة تلمسان',
  'جامعة باتنة',
  'جامعة بجاية',
  'جامعة عنابة'
];

export const cities = [
  'الجزائر',
  'وهران',
  'قسنطينة',
  'سطيف',
  'تلمسان',
  'باتنة',
  'بجاية',
  'عنابة',
  'تيزي وزو',
  'البليدة'
];

export const supervisors = [
  'د. فاطمة بن علي',
  'د. محمد الأمين',
  'د. عائشة بلقاسم',
  'د. كريم بن سعد',
  'د. نادية حسني',
  'د. سليم بوعلام',
  'د. حسام الدين رشيد',
  'د. سميرة زهراني'
];