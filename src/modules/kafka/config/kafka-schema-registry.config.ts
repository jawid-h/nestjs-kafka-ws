import { IsNotEmpty, IsString, validate } from 'class-validator';
import { ConfigValidationError } from 'src/modules/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/modules/core/utils/map-validation-errors';

export class KafkaConfigSchemaRegistry {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    static async fromEnv(env: Record<string, string>) {
        const instance = new KafkaConfigSchemaRegistry();

        instance.url = env.KAFKA_SCHEMA_REGISTRY_URL || '';
        instance.username = env.KAFKA_SCHEMA_REGISTRY_USERNAME || '';
        instance.password = env.KAFKA_SCHEMA_REGISTRY_PASSWORD || '';

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError(
                'Kafka schema registry config validation error',
                mapValidationErrors(validationErrors),
            );
        }

        return instance;
    }
}
