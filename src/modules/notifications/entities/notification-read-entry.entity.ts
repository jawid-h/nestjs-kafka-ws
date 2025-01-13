import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { MikroOrmMongoEntity } from 'src/database/entities/base-mongo-mikroorm.entity';
import { NotificationEntity } from './notification.entity';

@Entity({ collection: 'notifications_read_entries' })
export class NotificationReadEntryEntity extends MikroOrmMongoEntity {
    @ManyToOne(() => NotificationEntity)
    notification: NotificationEntity;

    @Property()
    username: string;

    @Property({ type: 'date', default: null })
    readAt: Date;
}
