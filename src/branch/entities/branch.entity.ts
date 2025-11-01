import { Entity } from 'typeorm';
import { Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';


@Entity()

export class Branch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: string;

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
