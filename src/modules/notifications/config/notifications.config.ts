import { Type } from 'class-transformer';
import { NotificationsKafkaTopics } from './notifications-kafka-topics.config';
import { validate, ValidateNested } from 'class-validator';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';
import { registerAs } from '@nestjs/config';

export class NotificationConfig {
    @ValidateNested()
    @Type(() => NotificationsKafkaTopics)
    kafkaTopics: NotificationsKafkaTopics;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new NotificationConfig();

        instance.kafkaTopics = await NotificationsKafkaTopics.fromEnv(env);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('Notifications config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}

export const notificationsConfig = registerAs(
    'notifications',
    async (): Promise<NotificationConfig> => NotificationConfig.fromEnv(process.env),
);
