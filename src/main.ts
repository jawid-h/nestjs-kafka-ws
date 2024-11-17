import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaTopicDecoratorProcessorService } from './decorators/kafka-topic-decorator-processor.service';
import { NotificationsController } from './notifications/notifications.controller';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    // Setting up logger
    app.useLogger(app.get(Logger));

    // Process all KafkaTopicFromConfig decorators
    // for all controllers that listen to Kafka messages
    app.get(KafkaTopicDecoratorProcessorService).processKafkaDecorators([
        NotificationsController,
    ]);

    // Get configuration service at the start
    // to be able to configure app itself
    const configService = app.get(ConfigService);

    // Get corresponding Kafka configuration
    const kafkaConfigClientId = configService.get<string>('kafka.clientId');
    const kafkaConfigBrokers = configService.get<string[]>('kafka.brokers');
    const kafkaConfigGroupId = configService.get<string>('kafka.groupId');

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: kafkaConfigClientId,
                brokers: kafkaConfigBrokers,
            },
            consumer: {
                groupId: kafkaConfigGroupId,
            },
            run: {
                // manually setting this to false
                // as it is represents logic of the app
                autoCommit: false,
            },
        },
    });

    await app.startAllMicroservices();

    // Get corresponding app configuration
    const appConfigPort = configService.get<number>('app.port');

    await app.listen(appConfigPort ?? 3000);
}

bootstrap();
