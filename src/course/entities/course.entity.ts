import { Column, Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, ManyToMany, AfterInsert } from "typeorm";
import { PrerequisiteCourse } from "./prerequisite-course.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Student } from "src/student/entities/student.entity";


@Entity('courses')
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    title: string;

    @Column()
    description: string;

    @Column()
    duration: number;

    @Column()
    price: number;

    @Column({ unique: true , nullable: true})
    code: string;

    @ManyToMany(() => Teacher, teacher => teacher.courses)
    teachers: Teacher[];
    

    @OneToMany(() => PrerequisiteCourse, prerequisiteCourse => prerequisiteCourse.course)
    prerequisiteCourses: PrerequisiteCourse[];
    
}
