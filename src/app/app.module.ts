import { NotificationsGateway } from './../notifications/notifications.gateway';

import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { KafkaTopicDecoratorProcessorService } from 'src/decorators/kafka-topic-decorator-processor.service';
import { LoggerModule } from 'nestjs-pino';
import {
    PinoElasticsearchOptions,
    PinoTransportTarget,
} from 'src/interfaces/pino-config.interface';

// import configuration files separately
import { kafkaConfig } from '../config/kafka.config';
import { appConfig } from 'src/config/app.config';
import { pinoConfig } from 'src/config/pino.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, kafkaConfig, pinoConfig],
        }),
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const logLevel = configService.get<string>(
                    'pino.pinoHttp.level',
                    'debug',
                );
                const targets = configService.get<PinoTransportTarget[]>(
                    'pino.pinoHttp.targes',
                    [{ target: 'pino-pretty' }],
                );

                return {
                    pinoHttp: {
                        level: logLevel,
                        transport: {
                            targets: targets.map((target) => {
                                if (target.target === 'pino-elasticsearch') {
                                    return {
                                        target: 'pino-elasticsearch',
                                        options: {
                                            node: (
                                                target.options as PinoElasticsearchOptions
                                            ).node,
                                        },
                                    };
                                }

                                return {
                                    target: target.target,
                                };
                            }),
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
        NotificationsModule,
    ],
    providers: [
        NotificationsGateway,
        KafkaTopicDecoratorProcessorService,
        AppService,
    ],
})
export class AppModule {}
