import { Column, Entity, OneToOne, PrimaryGeneratedColumn , JoinColumn, AfterInsert, AfterUpdate, AfterRemove} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Exclude } from "class-transformer";
import { BranchManager } from "src/branch-manager/entities/branch-manager.entity";

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

    @OneToOne(() => BranchManager, branchManager => branchManager.staff)
    branchManager: BranchManager;

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