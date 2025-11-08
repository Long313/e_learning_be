import { Column, Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { PrerequisiteCourse } from "./prerequisite-course.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";


@Entity('courses')
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    duration: number;

    @Column()
    price: number;

    @ManyToMany(() => Teacher, teacher => teacher.courses)
    teachers: Teacher[];

    @OneToMany(() => PrerequisiteCourse, prerequisiteCourse => prerequisiteCourse.course)
    prerequisiteCourses: PrerequisiteCourse[];
    
}
