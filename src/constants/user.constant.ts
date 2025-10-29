const USER_TYPES = ['student', 'parent', 'staff', 'admin'] as const;
const GENDERS = ['male', 'female', 'other'] as const;

// Type from const
type UserType = typeof USER_TYPES[number];
type Gender = typeof GENDERS[number];

export { USER_TYPES, GENDERS };
export type { UserType, Gender };