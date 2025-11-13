import { CourseRegistration } from "src/course-registration/entities/course-registration.entity";
import { Course } from "src/course/entities/course.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"

export const CLASS_STATUS = ['upcoming', 'in_progress', 'completed', 'canceled'] as const;

export type ClassStatusType = typeof CLASS_STATUS[number];

@Entity('classes')
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({nullable: true})
    startDate: Date;

    @Column({nullable: true})
    endDate: Date;

    @Column({
        type: 'enum',
        enum: CLASS_STATUS,
        default: 'upcoming',
    })
    status: ClassStatusType;

    @ManyToOne(() => Course, (course) => course.classes, { eager: true })
    course: Course;

    @ManyToOne(() => Teacher, (teacher) => teacher.classes, { eager: true })
    teacher: Teacher;

    @OneToMany(() => CourseRegistration, registration => registration.class)
    courseRegistrations: CourseRegistration[];

    get students() {
        if (this.courseRegistrations && this.courseRegistrations.length > 0) {
            return this.courseRegistrations.map(registration => registration.student);
        }
        return [];
    }
}
