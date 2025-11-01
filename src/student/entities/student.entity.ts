import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, AfterInsert, AfterUpdate, JoinColumn } from 'typeorm';

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

    @AfterInsert()
    logInsert() {
        console.log(`Student entity with ID ${this.id} has been inserted.`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Student entity with ID ${this.id} has been updated.`);
    }
}
