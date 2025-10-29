import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

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
}
