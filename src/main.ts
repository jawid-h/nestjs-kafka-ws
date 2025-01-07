import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaTopicDecoratorProcessorService } from './kafka/services/kafka-topic-decorator-processor.service';
import { NotificationsController } from './modules/notifications/controllers/notifications.controller';
import { Logger } from 'nestjs-pino';
import { KafkaConfig } from './kafka/config/kafka.config';
import { AppConfig } from './app/config/app.config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    // Setting up logger
    app.useLogger(app.get(Logger));

    // Process all KafkaTopicFromConfig decorators
    // for all controllers that listen to Kafka messages
    app.get(KafkaTopicDecoratorProcessorService).processKafkaDecorators([NotificationsController]);

    // Get configuration service at the start
    // to be able to configure app itself
    const configService = app.get(ConfigService);

    // Get corresponding app configuration
    const appConfig = configService.get<AppConfig>('app');

    if (appConfig.versioning.enabled) {
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: '1',
            prefix: appConfig.versioning.prefix,
        });
    }

    app.setGlobalPrefix(appConfig.globalPrefix);

    // Configure Swagger
    const apiDocumentV1 = new DocumentBuilder()
        .setTitle(appConfig.name)
        .setDescription(appConfig.description)
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    SwaggerModule.setup('api/v1/docs', app, SwaggerModule.createDocument(app, apiDocumentV1));

    // Get corresponding Kafka configuration
    const kafkaConfig = configService.get<KafkaConfig>('kafka');

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: kafkaConfig.client.clientId,
                brokers: kafkaConfig.client.brokers,
                retry: {
                    initialRetryTime: kafkaConfig.client.initialRetryTime,
                    retries: kafkaConfig.client.numberOfRetries,
                },
            },
            consumer: {
                groupId: kafkaConfig.consumer.groupId,
                sessionTimeout: kafkaConfig.consumer.sessionTimeout,
            },
            run: {
                // manually setting this to false
                // as it is represents logic of the app
                autoCommit: false,
            },
        },
    });

    // Enable global validation and transformation
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: false,
        }),
    );

    await app.startAllMicroservices();

    await app.listen(appConfig.port, appConfig.host);
}

bootstrap();
