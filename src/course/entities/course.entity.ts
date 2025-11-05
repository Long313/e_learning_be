import { Column, Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { PrerequisiteCourse } from "./prerequisite-course.entity";
import { BaseEntity } from "src/common/entities/base.entity";


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

    @OneToMany(() => PrerequisiteCourse, prerequisiteCourse => prerequisiteCourse.course)
    prerequisiteCourses: PrerequisiteCourse[];
    
}
