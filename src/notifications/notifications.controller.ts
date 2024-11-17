import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, Payload } from '@nestjs/microservices';
import { KafkaTopicFromConfig } from 'src/decorators/kafka-topic.decorator';
import { NotificationsService } from './notifications.service';
import { NotificationMessage } from 'src/interfaces/notification.interface';
import { InjectSchemaRegistry } from '@goopen/nestjs-schema-registry';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService,
        @InjectSchemaRegistry() private readonly schemaRegistry: SchemaRegistry,
        @InjectPinoLogger(NotificationsController.name)
        private readonly logger: PinoLogger,
    ) {}

    @KafkaTopicFromConfig('kafka.topics.notifications')
    async onNotificationReceived(
        @Payload() notificationMessage: Buffer,
        @Ctx() kafkaContext: KafkaContext,
    ) {
        try {
            const { offset } = kafkaContext.getMessage();
            const partition = kafkaContext.getPartition();
            const topic = kafkaContext.getTopic();
            const consumer = kafkaContext.getConsumer();

            const decodedMessage: NotificationMessage =
                await this.schemaRegistry.decode(notificationMessage);

            // TODO: should we use exponential backoff?

            this.notificationService.processNotification(decodedMessage);

            await consumer.commitOffsets([{ topic, partition, offset }]);
        } catch (error) {
            this.logger.error(
                error,
                'Error processing notification message from Kafka',
            );
        }
    }
}
