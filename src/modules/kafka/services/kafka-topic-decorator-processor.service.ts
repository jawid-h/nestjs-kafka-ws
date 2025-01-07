import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern } from '@nestjs/microservices';
import { KAFKA_TOPIC_DECORATOR_META } from 'src/modules/kafka/constants/kafka-topic-decorator.constants';

@Injectable()
export class KafkaTopicDecoratorProcessorService {
    constructor(private readonly configService: ConfigService) {}

    // Basically, this function searches for the KafkaTopicFromConfig decorator in the provided types
    // and processes them by decorating the method with the EventPattern decorator
    // with the topic value from the config service
    processKafkaDecorators(types: any[]) {
        for (const type of types) {
            const propertyNames = Object.getOwnPropertyNames(type.prototype);

            for (const propertyName of propertyNames) {
                const propertyMetadata = Reflect.getMetadata(
                    KAFKA_TOPIC_DECORATOR_META,
                    Reflect.get(type.prototype, propertyName),
                );

                if (propertyMetadata) {
                    const topic = this.configService.get<string>(propertyMetadata);

                    Reflect.decorate(
                        [EventPattern(topic)],
                        type.prototype,
                        propertyName,
                        Reflect.getOwnPropertyDescriptor(type.prototype, propertyName),
                    );
                }
            }
        }
    }
}
