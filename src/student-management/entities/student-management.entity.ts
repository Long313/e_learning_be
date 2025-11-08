import { Staff } from "src/staff/entities/staff.entity";
import { Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Branch } from "src/branch/entities/branch.entity";


@Entity('student_managements')

export class StudentManagement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Staff, (staff) => staff.studentManagement)
    @JoinColumn({ name: 'staffId' })
    staff: Staff;

    @ManyToOne(() => Branch, (branch) => branch.studentManagements)
    branch: Branch;
}