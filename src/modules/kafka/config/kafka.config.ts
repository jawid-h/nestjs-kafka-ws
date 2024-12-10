import { ValidateNested, validate } from 'class-validator';
import { Type } from 'class-transformer';
import { registerAs } from '@nestjs/config';
import { ConfigValidationError } from 'src/modules/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/modules/core/utils/map-validation-errors';
import { KafkaConfigSchemaRegistry } from './kafka-schema-registry.config';
import { KafkaClientConfig } from './kafka-client.config';
import { KafkaConsumerConfig } from './kafka-consumer.config';

export class KafkaConfig {
    @ValidateNested()
    @Type(() => KafkaClientConfig)
    client: KafkaClientConfig;

    @ValidateNested()
    @Type(() => KafkaConsumerConfig)
    consumer: KafkaConsumerConfig;

    @ValidateNested()
    @Type(() => KafkaConfigSchemaRegistry)
    schemaRegistry: KafkaConfigSchemaRegistry;

    static async fromEnv(env: Record<string, string>) {
        const instance = new KafkaConfig();

        instance.client = await KafkaClientConfig.fromEnv(env);
        instance.consumer = await KafkaConsumerConfig.fromEnv(env);
        instance.schemaRegistry = await KafkaConfigSchemaRegistry.fromEnv(env);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError(
                'Kafka config validation error',
                mapValidationErrors(validationErrors),
            );
        }

        return instance;
    }
}

export const kafkaConfig = registerAs(
    'kafka',
    async (): Promise<KafkaConfig> => KafkaConfig.fromEnv(process.env),
);
