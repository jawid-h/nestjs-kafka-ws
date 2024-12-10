import {
    BeforeCreate,
    BeforeUpdate,
    Entity,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { BaseEntity } from './base.entity';
import { DateToMillisTransformer } from '../transformers/date-to-millis.transformer';

@Entity()
export abstract class MikroOrmMongoEntity extends BaseEntity<ObjectId> {
    @PrimaryKey({ name: '_id' })
    id: ObjectId;

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
