import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { COURSE_REGISTRATION_TUITION_STATUS } from 'src/constants/course.constant';
import type { CourseRegistrationTuitionStatusType } from 'src/constants/course.constant';

@Entity('course_registrations')

export class CourseRegistration {
    @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'enum', enum: COURSE_REGISTRATION_TUITION_STATUS })
  tuitionStatus: CourseRegistrationTuitionStatusType;
}
