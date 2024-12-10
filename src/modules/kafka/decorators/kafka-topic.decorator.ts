import { KAFKA_TOPIC_DECORATOR_META } from 'src/modules/kafka/constants/kafka-topic-decorator.constants';

export function KafkaTopicFromConfig(configVariablePath: string): any {
    return (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor,
    ) => {
        Reflect.defineMetadata(
            KAFKA_TOPIC_DECORATOR_META,
            configVariablePath,
            descriptor.value,
        );

        return descriptor;
    };
}
