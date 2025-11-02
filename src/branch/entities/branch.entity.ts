import { BranchManager } from 'src/branch-manager/entities/branch-manager.entity';
import { Entity } from 'typeorm';
import { Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, OneToMany } from 'typeorm';


@Entity('branches')

export class Branch {
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
