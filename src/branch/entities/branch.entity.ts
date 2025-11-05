import { BranchManager } from 'src/branch-manager/entities/branch-manager.entity';
import { Student } from 'src/student/entities/student.entity';
import { Entity, ManyToMany } from 'typeorm';
import { Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('branches')

export class Branch extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: string;

    @OneToMany(() => BranchManager, (manager) => manager.branch)
    managers: BranchManager[];

    @OneToMany(() => Student, (student) => student.branch)
    students: Student[];

    @AfterInsert()
    logInsert() {
        console.log(`Branch inserted with id: ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Branch updated with id: ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`Branch removed with id: ${this.id}`);
    }
}
