import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, AfterInsert, AfterUpdate, AfterRemove, OneToOne, JoinColumn } from 'typeorm';
import { Branch } from 'src/branch/entities/branch.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('branch_managers')
export class BranchManager extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Branch, (branch) => branch.managers)
  branch: Branch;

  @OneToOne(() => Staff, (staff) => staff.branchManager)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

    @AfterInsert()
    logInsert() {
        console.log(`BranchManager inserted with id: ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`BranchManager updated with id: ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`BranchManager removed with id: ${this.id}`);
    }
}
