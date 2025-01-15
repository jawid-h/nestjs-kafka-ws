import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { KafkaModule } from '../../kafka/kafka.module';
import { NotificationEntity } from './entities/notification.entity';
import { DatabaseModule } from '../../database/database.module';
import { DATABASE_SOURCE_SOURCE_A } from '../../app/constants/database.constants';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
    imports: [
        KafkaModule.register({
            useSchemaRegistry: false,
        }),
        DatabaseModule.forFeature({
            mikroORMOptions: {
                entities: [NotificationEntity],
                contextName: DATABASE_SOURCE_SOURCE_A,
            },
        }),
        ClientsModule,
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsGateway],
    exports: [NotificationsService],
})
export class NotificationsModule {}
