import { IsString, IsNotEmpty, validate, IsInt, IsPositive } from 'class-validator';
import { ConfigValidationError } from 'src/modules/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/modules/core/utils/map-validation-errors';

export class KafkaConsumerConfig {
    @IsString()
    @IsNotEmpty()
    groupId: string;

    @IsInt()
    @IsPositive()
    sessionTimeout: number;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new KafkaConsumerConfig();

        instance.groupId = env.KAFKA_GROUP_ID || '';
        instance.sessionTimeout = parseInt(env.KAFKA_CONSUMER_SESSION_TIMEOUT || '30000', 10);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('Kafka consumer config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}
