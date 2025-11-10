import { Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Exclude } from 'class-transformer';

export class BaseEntity {
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Exclude()
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    createdBy: User | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Exclude()
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
    updatedBy: User | null;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @Exclude()
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'deleted_by', referencedColumnName: 'id' })
    deletedBy: User | null;
}