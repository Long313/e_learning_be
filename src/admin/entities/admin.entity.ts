import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { ADMIN_TYPES } from "src/constants/user.constant";
import type { AdminType } from "src/constants/user.constant";
import { User } from "src/user/entities/user.entity";

@Entity('admins')

export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {
        type: 'enum',
        enum: ADMIN_TYPES,
    })
    type: AdminType;

    @OneToOne(() => User, user => user.admin, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
