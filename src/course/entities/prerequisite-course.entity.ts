import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Course } from "./course.entity";

@Entity('prerequisite_courses')
export class PrerequisiteCourse {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Course, course => course.id, { onDelete: 'CASCADE' })
    course: Course;

    @ManyToOne(() => Course, course => course.id, { onDelete: 'CASCADE' })
    prerequisite: Course;
}