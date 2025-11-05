import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { USER_TYPES, GENDERS, STATUS, AssociatedEntity, ROLES_MAP} from '../../constants/user.constant';
import { Student } from 'src/student/entities/student.entity';
import { Exclude } from 'class-transformer';
import { Staff } from 'src/staff/entities/staff.entity';
import { Admin } from 'src/admin/entities/admin.entity';
@Entity('users')
export class User {

    // Columns
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
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
    dayOfBirth: Date;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({
        type: 'enum',
        enum: STATUS,
        default: 'pending',
    })
    status: string;

    @Column({
        type: 'enum',
        enum: USER_TYPES
    })
    userType: string;    

    @Column({ type: 'uuid', nullable: true })
    userTypeId: string;

    @Exclude()
    @Column({ unique: true, nullable: true })
    refreshToken: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Exclude()
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    createdBy: User | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Exclude()
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
    updatedBy: User | null;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @Exclude()
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'deleted_by', referencedColumnName: 'id' })
    deletedBy: User | null;

    // Relations

    @OneToOne(() => Student, student => student.user)
    student: Student;

    @OneToOne(() => Staff, staff => staff.user)
    staff: Staff;

    @OneToOne(() => Admin, admin => admin.user)
    admin: Admin;

    // Lifecycle Hooks

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


    // Custom Methods

    getAge(): number {
        const currentYear = new Date().getFullYear();
        return currentYear - this.dayOfBirth.getFullYear();
    }

    getRoles(): string[] {
        if (['student', 'admin'].includes(this.userType)) {
            return [ROLES_MAP[this.userType]];
        }
        if (this.userType === 'staff') {
            const roles: string[] = [];
            if (this.staff) {
                if (this.staff.teacher) {
                    roles.push(ROLES_MAP['teacher']);
                }
                if (this.staff.branchManager) {
                    roles.push(ROLES_MAP['branch_manager']);
                }
            }
            return roles;
        }
        return []
    }

    getAssociatedEntity(): AssociatedEntity {
        if (this.userType === 'student') {
            return this.student; 
        } else if (this.userType === 'staff') {
            return this.staff;
        }
        return null;
    }
}