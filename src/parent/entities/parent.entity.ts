
import { Student } from "src/student/entities/student.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity('parents')
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ nullable: true })
    deletedBy: string;

    @ManyToOne(() => Student, student => student.parents)
    student: Student;
}