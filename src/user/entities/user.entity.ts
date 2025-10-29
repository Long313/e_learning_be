import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { USER_TYPES, GENDERS } from '../../constants/user.constant';
import { Student } from 'src/student/entities/student.entity';
import { RefreshToken } from 'src/auth/entitites/refresh-token.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({nullable: true})
    password: string;

    @Column()
    fullName: string;

    @Column({ 
        type: 'enum',
        enum: GENDERS
    })
    gender: string;

    @Column()
    yearOfBirth: number;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({
        type: 'enum',
        enum: USER_TYPES
    })
    userType: string;    

    @Column({ nullable: true })
    userTypeId: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => Student, student => student.user)
    @JoinColumn({ name: 'userTypeId', referencedColumnName: 'id' })
    student: Student;

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];

    @AfterInsert()
    logInsert() {
        console.log(`User with ID ${this.id} has been inserted.`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`User with ID ${this.id} has been removed.`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`User with ID ${this.id} has been updated.`);
    }


    getAge(): number {
        const currentYear = new Date().getFullYear();
        return currentYear - this.yearOfBirth;
    }
}