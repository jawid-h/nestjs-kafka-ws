import { IsNotEmpty, IsString, validate } from 'class-validator';
import { ConfigValidationError } from 'src/modules/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/modules/core/utils/map-validation-errors';

export class NotificationsKafkaTopics {
    @IsString()
    @IsNotEmpty()
    notifications: string;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new NotificationsKafkaTopics();

        instance.notifications = env.NOTIFICATIONS_KAFKA_TOPICS_NOTIFICATIONS;

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError(
                'Notifications Kafka topics config validation error',
                mapValidationErrors(validationErrors),
            );
        }

        return instance;
    }
}
