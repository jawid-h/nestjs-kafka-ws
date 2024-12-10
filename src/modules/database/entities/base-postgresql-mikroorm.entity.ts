import {
    BeforeCreate,
    BeforeUpdate,
    Entity,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { DateToMillisTransformer } from '../transformers/date-to-millis.transformer';

@Entity()
export abstract class MikroOrmPostgresqlEntity<
    ID = number,
> extends BaseEntity<ID> {
    @PrimaryKey()
    id: ID;

    @Property({ type: DateToMillisTransformer })
    createdAt?: number;

    @Property({ type: DateToMillisTransformer })
    updatedAt?: number;

    @BeforeCreate()
    setCreatedAt() {
        this.createdAt = Date.now();
        this.updatedAt = this.createdAt;
    }

    @BeforeUpdate()
    setUpdatedAt() {
        this.updatedAt = Date.now();
    }
}
