import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { SchemaRegistryModule } from '@goopen/nestjs-schema-registry';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        SchemaRegistryModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                host: configService.get<string>('kafka.schemaRegistry.url'),
                auth: {
                    username: configService.get<string>(
                        'kafka.schemaRegistry.username',
                    ),
                    password: configService.get<string>(
                        'kafka.schemaRegistry.password',
                    ),
                },
            }),
        }),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
