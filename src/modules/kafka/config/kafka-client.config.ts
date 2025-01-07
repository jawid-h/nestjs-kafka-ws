import { IsArray, IsInt, IsNotEmpty, IsPositive, IsString, validate } from 'class-validator';
import { IsIpPort } from 'src/modules/core/decorators/is-ip-port.decorator';
import { ConfigValidationError } from 'src/modules/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/modules/core/utils/map-validation-errors';

export class KafkaClientConfig {
    @IsString()
    @IsNotEmpty()
    clientId: string;

    @IsArray()
    @IsNotEmpty({ each: true })
    @IsIpPort({ each: true })
    brokers: string[];

    @IsInt()
    @IsPositive()
    numberOfRetries: number;

    @IsInt()
    @IsPositive()
    initialRetryTime: number;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new KafkaClientConfig();

        instance.clientId = env.KAFKA_CLIENT_ID || '';
        instance.brokers = (env.KAFKA_BROKERS || '').split(',').map((broker) => broker.trim());
        instance.numberOfRetries = parseInt(env.KAFKA_CLIENT_NUMBER_OF_RETRIES || '5', 10);
        instance.initialRetryTime = parseInt(env.KAFKA_CLIENT_INITIAL_RETRY_TIME || '300', 10);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('Kafka client config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}
