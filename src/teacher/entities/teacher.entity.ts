import { Column, OneToOne, JoinColumn, Entity, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";
import { ACADEMIC_TITLES, DEGREES } from "src/constants/user.constant";
import { Staff } from "src/staff/entities/staff.entity";


@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    major: string;

    @Column({
        type: 'enum',
        enum: ACADEMIC_TITLES
    })
    academic_title: string | null;

    @Column({   
        type: 'enum',
        enum: DEGREES
    })
    degree: string;

    @OneToOne(() => Staff, staff => staff.teacher , { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'staffId' })
    staff: Staff;

    @AfterInsert()
    logInsert() {
        console.log(`Teacher inserted with id: ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Teacher updated with id: ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`Teacher removed with id: ${this.id}`);
    }
}