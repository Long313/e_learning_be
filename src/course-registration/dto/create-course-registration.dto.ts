import { IsEnum, IsNotEmpty } from 'class-validator';
import { COURSE_REGISTRATION_TUITION_STATUS } from 'src/constants/course.constant';
import type { CourseRegistrationTuitionStatusType } from 'src/constants/course.constant';
import { Course } from 'src/course/entities/course.entity';
import { Student } from 'src/student/entities/student.entity';

export class CreateCourseRegistrationDto {
  @IsNotEmpty()
  student: Student;

  @IsNotEmpty()
  course: Course;

  @IsEnum(COURSE_REGISTRATION_TUITION_STATUS)
  tuitionStatus: CourseRegistrationTuitionStatusType;
}
