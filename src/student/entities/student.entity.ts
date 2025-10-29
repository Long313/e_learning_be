import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, AfterInsert, AfterUpdate } from 'typeorm';

@Entity('students')

export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    schoolGrade: number;

    @Column()
    startDate: Date;

    @OneToOne(() => User, user => user.student)
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
