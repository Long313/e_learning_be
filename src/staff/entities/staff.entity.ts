import { Column, Entity, OneToOne, PrimaryGeneratedColumn , JoinColumn, AfterInsert, AfterUpdate, AfterRemove} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Exclude } from "class-transformer";

@Entity('staffs')
export class Staff {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Exclude()
    @Column()
    basicSalary: number;

    @OneToOne(() => User, user => user.staff , { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToOne(() => Teacher, teacher => teacher.staff)
    teacher: Teacher;

    @OneToOne(() => Staff, staff => staff.branchManager)
    branchManager: Staff;

    @AfterInsert()
    logInsert() {
        console.log(`Staff inserted with id: ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Staff updated with id: ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`Staff removed with id: ${this.id}`);
    }
}