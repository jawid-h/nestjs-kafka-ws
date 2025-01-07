import { Entity, Property } from '@mikro-orm/core';
import { MikroOrmMongoEntity } from 'src/database/entities/base-mongo-mikroorm.entity';

@Entity({ collection: 'notifications' })
export class NotificationEntity extends MikroOrmMongoEntity {
    @Property()
    title: string;

    @Property()
    body: string;

    @Property({ default: false })
    isRead: boolean = false;
}
