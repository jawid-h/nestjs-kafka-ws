import 'reflect-metadata';
import { KafkaTopicFromConfig } from '../../../src/decorators/kafka-topic.decorator';
import { KAFKA_TOPIC_DECORATOR_META } from '../../../src/constants/kafka-topic-decorator.constants';

describe('KafkaTopicFromConfig', () => {
    it('should define metadata on the method descriptor', () => {
        const configVariablePath = 'some.config.path';
        const target = {};
        const key = 'testMethod';
        const descriptor: PropertyDescriptor = {
            value: jest.fn(),
        };

        KafkaTopicFromConfig(configVariablePath)(target, key, descriptor);

        const metadata = Reflect.getMetadata(
            KAFKA_TOPIC_DECORATOR_META,
            descriptor.value,
        );
        expect(metadata).toBe(configVariablePath);
    });

    it('should return the descriptor', () => {
        const configVariablePath = 'some.config.path';
        const target = {};
        const key = 'testMethod';
        const descriptor: PropertyDescriptor = {
            value: jest.fn(),
        };

        const result = KafkaTopicFromConfig(configVariablePath)(
            target,
            key,
            descriptor,
        );

        expect(result).toBe(descriptor);
    });
});
