import { Branch } from 'src/branch/entities/branch.entity';
import { CourseRegistration } from 'src/course-registration/entities/course-registration.entity';
import { Course } from 'src/course/entities/course.entity';
import { Parent } from 'src/parent/entities/parent.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, AfterInsert, AfterUpdate, JoinColumn, OneToMany, ManyToOne, JoinTable, ManyToMany } from 'typeorm';

@Entity('students')

export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    schoolGrade: number;

    @Column()
    startDate: Date;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToOne(() => User, user => user.student, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Parent, parent => parent.student)
    parents: Parent[];

    @ManyToOne(() => Branch, branch => branch.students, { onDelete: 'SET NULL' })
    branch: Branch | null;

    @OneToMany(() => CourseRegistration, courseRegistration => courseRegistration.student)
    courseRegistrations: CourseRegistration[];

    get courses(): Course[] {
        if (this.courseRegistrations && this.courseRegistrations.length > 0) {
            return this.courseRegistrations.map(cr => cr.course);
        }
        return [];
    }


    @AfterInsert()
    logInsert() {
        console.log(`Student entity with ID ${this.id} has been inserted.`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Student entity with ID ${this.id} has been updated.`);
    }
}
