import { Column, OneToOne, JoinColumn, Entity, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { ACADEMIC_TITLES, DEGREES } from "src/constants/user.constant";
import { Staff } from "src/staff/entities/staff.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { Course } from "src/course/entities/course.entity";


@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    major: string;

    @Column({
        type: 'enum',
        enum: ACADEMIC_TITLES,
        nullable: true
    })
    academicTitle: string | null;

    @Column({
        type: 'enum',
        enum: DEGREES,
        nullable: true
    })
    degree: string;

    @OneToOne(() => Staff, staff => staff.teacher, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'staffId' })
    staff: Staff;

    @ManyToOne(() => Branch, branch => branch.teachers, { onDelete: 'SET NULL' })
    branch: Branch | null;

    @ManyToMany(() => Course, course => course.teachers)
    @JoinTable({
        name: 'teacher_courses',
        joinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'course_id', referencedColumnName: 'id' },
    })
    courses: Course[];

    @AfterInsert()
    logInsert() {
        console.log(`Teacher inserted with id: ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Teacher updated with id: ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`Teacher removed with id: ${this.id}`);
    }
}