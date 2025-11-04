import { Branch } from 'src/branch/entities/branch.entity';
import { Parent } from 'src/parent/entities/parent.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, AfterInsert, AfterUpdate, JoinColumn, OneToMany } from 'typeorm';

@Entity('students')

export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    schoolGrade: number;

    @Column()
    startDate: Date;

    @OneToOne(() => User, user => user.student, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Parent, parent => parent.student)
    parents: Parent[];

    @OneToMany(() => Branch, branch => branch.students)
    branch: Branch;

    @AfterInsert()
    logInsert() {
        console.log(`Student entity with ID ${this.id} has been inserted.`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Student entity with ID ${this.id} has been updated.`);
    }
}
