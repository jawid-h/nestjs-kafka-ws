import { registerAs } from '@nestjs/config';
import { ConfigValidationError } from 'src/errors/config/config-validation.error';
import { KafkaConfig } from 'src/interfaces/kafka-config.interface';
import { mapValidationErrors } from 'src/utils/map-validation-errors';
import { kafkaConfigSchema } from 'src/validation-schemas/config/kafka-config.schema';

export const createKafkaConfig = (env: Record<string, string>): KafkaConfig => {
    const { error, value } = kafkaConfigSchema.validate(
        {
            clientId: env.KAFKA_CLIENT_ID,
            brokers: env.KAFKA_BROKERS,
            groupId: env.KAFKA_GROUP_ID,
            topics: {
                notifications: env.KAFKA_TOPICS_NOTIFICATION,
            },
            schemaRegistry: {
                url: env.KAFKA_SCHEMA_REGISTRY_URL,
                username: env.KAFKA_SCHEMA_REGISTRY_USERNAME,
                password: env.KAFKA_SCHEMA_REGISTRY_PASSWORD,
            },
        },
        { abortEarly: false },
    );

    if (error) {
        const validationErrors = mapValidationErrors(error.details);

        throw new ConfigValidationError(
            'Kafka config validation error',
            validationErrors,
        );
    }

    return value;
};

export const kafkaConfig = registerAs(
    'kafka',
    (): KafkaConfig => createKafkaConfig(process.env),
);
