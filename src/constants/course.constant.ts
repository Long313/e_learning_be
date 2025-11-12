const COURSE_REGISTRATION_TUITION_STATUS = ['paid', 'unpaid', 'refunded'] as const;
const VIEW_STUDENT_COURSE_REGISTRATION_ROLES = ['admin', 'student']
const COURSE_STATUS = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;

type CourseRegistrationTuitionStatusType = typeof COURSE_REGISTRATION_TUITION_STATUS[number];
type CourseStatusType = typeof COURSE_STATUS[number];

export { COURSE_REGISTRATION_TUITION_STATUS, VIEW_STUDENT_COURSE_REGISTRATION_ROLES, COURSE_STATUS };
export type { CourseRegistrationTuitionStatusType, CourseStatusType };