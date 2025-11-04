import { Column, Entity } from "typeorm";


@Entity('courses')
export class Course {
    @Column('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    duration: number;

    @Column()
    price: number;
}
