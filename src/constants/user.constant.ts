import { Staff } from "src/staff/entities/staff.entity";
import { Student } from "src/student/entities/student.entity";

const USER_TYPES = ['student', 'staff', 'admin'] as const;
const GENDERS = ['nam', 'nữ', 'khác'] as const;
const STATUS = ['active', 'inactive', 'pending'] as const;
const ACADEMIC_TITLES = ['Giáo sư', 'Phó giáo sư', null] as const;
const DEGREES = ['Sinh viên', 'Cử nhân', 'Thạc sĩ', 'Tiến sĩ'] as const;
const STAFF_TYPES = ['teacher', 'branch_manager'] as const;
const ADMIN_TYPES = ['super_admin', 'content_admin'] as const;
    

// Type from const
type UserType = typeof USER_TYPES[number];
type GenderType = typeof GENDERS[number];
type StatusType = typeof STATUS[number];
type AcademicTitleType = typeof ACADEMIC_TITLES[number];
type DegreeType = typeof DEGREES[number];
type StaffType = typeof STAFF_TYPES[number];
type AdminType = typeof ADMIN_TYPES[number];

// Associated entity type
type AssociatedEntity = Student | Staff | null;

// English to Vietnamese mapping
const ROLES_MAP = {
    'student': 'Học viên',
    'staff': 'Nhân viên',
    'admin': 'Quản trị viên',
    'teacher': 'Giáo viên',
    'branch_manager': 'Quản lý chi nhánh',
    'student_management': 'Quản sinh'
};

export { USER_TYPES, GENDERS, STATUS, DEGREES, STAFF_TYPES, ACADEMIC_TITLES, ROLES_MAP, ADMIN_TYPES };
export type { UserType, GenderType, StatusType, DegreeType, AssociatedEntity, AcademicTitleType, StaffType, AdminType };