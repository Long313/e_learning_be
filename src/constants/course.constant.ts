const COURSE_REGISTRATION_TUITION_STATUS = ['paid', 'unpaid', 'refunded'] as const;
const VIEW_STUDENT_COURSE_REGISTRATION_ROLES = ['admin', 'student']

type CourseRegistrationTuitionStatusType = typeof COURSE_REGISTRATION_TUITION_STATUS[number];

export { COURSE_REGISTRATION_TUITION_STATUS, VIEW_STUDENT_COURSE_REGISTRATION_ROLES };
export type { CourseRegistrationTuitionStatusType };