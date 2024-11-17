import { kafkaConfigSchema } from '../../../src/validation-schemas/config/kafka-config.schema';

describe('Kafka Config Schema Validator', () => {
    let validConfig;

    beforeEach(() => {
        validConfig = {
            clientId: 'validClientId',
            brokers: 'localhost:9092,localhost:9093',
            groupId: 'validGroupId',
            topics: {
                notifications: 'validTopic',
            },
            schemaRegistry: {
                url: 'http://localhost:8081',
                username: 'validUser',
                password: 'validPass',
            },
        };
    });

    it('should validate a correct config', () => {
        const { error } = kafkaConfigSchema.validate(validConfig);
        expect(error).toBeUndefined();
    });

    it('should invalidate a config with invalid clientId', () => {
        validConfig.clientId = '1234';

        const { error } = kafkaConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with invalid brokers', () => {
        validConfig.brokers = 'localhost:9092,invalidBroker';

        const { error } = kafkaConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with invalid groupId', () => {
        validConfig.groupId = '12';

        const { error } = kafkaConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with invalid topic name', () => {
        validConfig.topics.notifications = '1234';

        const { error } = kafkaConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with invalid schema registry URL', () => {
        validConfig.schemaRegistry.url = 'invalidUrl';

        const { error } = kafkaConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with invalid schema registry username', () => {
        validConfig.schemaRegistry.username = '12';

        const { error } = kafkaConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with invalid schema registry password', () => {
        validConfig.schemaRegistry.password = '12';

        const { error } = kafkaConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });
});
