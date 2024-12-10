import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class TypeOrmEntity<ID = string> extends BaseEntity<ID> {
    @PrimaryGeneratedColumn('uuid')
    id: ID;

    @CreateDateColumn()
    createdAt?: number;

    @UpdateDateColumn()
    updatedAt?: number;
}
