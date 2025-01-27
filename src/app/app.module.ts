import { CoreModule } from '../core/core.module';
import { KafkaModule } from '../kafka/kafka.module';
import { NotificationsGateway } from '../modules/notifications/notifications.gateway';

import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { LoggerModule } from 'nestjs-pino';

// import configuration files separately
import { kafkaConfig } from 'src/kafka/config/kafka.config';
import { appConfig } from 'src/app/config/app.config';
import { PinoConfig, pinoConfig } from 'src/app/config/pino/pino.config';
import { authConfig } from 'src/auth/config/auth.config';
import { clientsConfig } from 'src/clients/config/clients.config';

import pino from 'pino';
import path from 'path';
import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { notificationsConfig } from '../modules/notifications/config/notifications.config';
import { databaseConfig, DatabaseMikroormSourceConfig, DatabaseSourceConnectionType } from '../database/config/database.config';
import { DATABASE_SOURCE_SOURCE_A } from './constants/database.constants';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, kafkaConfig, pinoConfig, notificationsConfig, databaseConfig, clientsConfig, authConfig],
        }),
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const pinoConfig = configService.get<PinoConfig>('pino');

                return {
                    pinoHttp: [
                        {
                            level: pinoConfig.level,
                        },
                        pino.multistream(await pinoConfig.getTargetStreams()),
                    ],
                };
            },
            inject: [ConfigService],
        }),
        I18nModule.forRootAsync({
            useFactory: () => ({
                fallbackLanguage: 'en',
                loaderOptions: {
                    use: I18nJsonLoader,
                    path: path.join(__dirname, '../i18n/'),
                    watch: true,
                },
            }),
            resolvers: [new HeaderResolver(['x-custom-lang'])],
        }),
        MikroOrmModule.forRootAsync({
            contextName: DATABASE_SOURCE_SOURCE_A,
            useFactory: (configService: ConfigService) => {
                const databaseConfig = configService.get('database');

                const sourceConfig: DatabaseMikroormSourceConfig = databaseConfig.sources[DATABASE_SOURCE_SOURCE_A];

                return {
                    driver: sourceConfig.connectionType === DatabaseSourceConnectionType.Mongodb ? MongoDriver : PostgreSqlDriver,
                    clientUrl: sourceConfig.connectionString,
                    dbName: sourceConfig.databaseName,
                    entities: sourceConfig.entityModules,
                    entitiesTs: sourceConfig.entityModulesTs,
                    registerRequestContext: false,
                    ensureIndexes: true,
                };
            },
            inject: [ConfigService],
        }),
        MikroOrmModule.forMiddleware(),
        CoreModule,
        KafkaModule,
        NotificationsModule,
        ClientsModule,
        AuthModule,
    ],
    providers: [NotificationsGateway, AppService],
})
export class AppModule {}
