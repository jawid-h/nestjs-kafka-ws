import { createKafkaConfig } from '../../../src/config/kafka.config';
import { ConfigValidationError } from '../../../src/errors/config/config-validation.error';

describe('createKafkaConfig', () => {
    const validEnv = {
        KAFKA_CLIENT_ID: 'test-client-id',
        KAFKA_BROKERS: 'broker1:8080,broker2:8081',
        KAFKA_GROUP_ID: 'test-group-id',
        KAFKA_TOPICS_NOTIFICATION: 'test-notification-topic',
        KAFKA_SCHEMA_REGISTRY_URL: 'http://localhost:8081',
        KAFKA_SCHEMA_REGISTRY_USERNAME: 'user',
        KAFKA_SCHEMA_REGISTRY_PASSWORD: 'password',
    };

    it('should return a valid KafkaConfig when environment variables are valid', () => {
        const config = createKafkaConfig(validEnv);
        expect(config).toEqual({
            clientId: 'test-client-id',
            brokers: ['broker1:8080', 'broker2:8081'],
            groupId: 'test-group-id',
            topics: {
                notifications: 'test-notification-topic',
            },
            schemaRegistry: {
                url: 'http://localhost:8081',
                username: 'user',
                password: 'password',
            },
        });
    });

    it('should throw ConfigValidationError when environment variables are invalid', () => {
        const invalidEnv = { ...validEnv, KAFKA_CLIENT_ID: '' };
        expect(() => createKafkaConfig(invalidEnv)).toThrow(
            ConfigValidationError,
        );
    });

    it('should throw ConfigValidationError with detailed validation errors', () => {
        const invalidEnv = { ...validEnv, KAFKA_CLIENT_ID: '' };
        try {
            createKafkaConfig(invalidEnv);
        } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);
            expect(error.validationErrors).toBeDefined();
        }
    });
});
