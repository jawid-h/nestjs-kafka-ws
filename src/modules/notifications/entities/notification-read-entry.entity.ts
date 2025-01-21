import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { MikroOrmMongoEntity } from 'src/database/entities/base-mongo-mikroorm.entity';
import { NotificationEntity } from './notification.entity';

@Entity({ collection: 'notifications_read_entries' })
export class NotificationReadEntryEntity extends MikroOrmMongoEntity {
    @Index()
    @Property()
    username: string;

    @Index()
    @Property({ type: 'date', default: null })
    readAt: Date;

    @ManyToOne(() => NotificationEntity)
    notification: NotificationEntity;
}
