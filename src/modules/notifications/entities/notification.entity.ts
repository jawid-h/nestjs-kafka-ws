import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { MikroOrmMongoEntity } from 'src/database/entities/base-mongo-mikroorm.entity';
import { NotificationReadEntryEntity } from './notification-read-entry.entity';

@Entity({ collection: 'notifications' })
export class NotificationEntity extends MikroOrmMongoEntity {
    @Property()
    loanAppId: string;

    @Property()
    status: string;

    @Property()
    timer: string;

    @Property()
    text: string;

    @OneToMany(() => NotificationReadEntryEntity, (read) => read.notification)
    readsEntries = new Collection<NotificationReadEntryEntity>(this);
}
