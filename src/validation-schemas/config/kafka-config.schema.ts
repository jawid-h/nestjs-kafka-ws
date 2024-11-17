import * as Joi from 'joi';
import {
    KafkaConfig,
    KafkaConfigSchemaRegistry,
    KafkaConfigTopics,
} from '../../interfaces/kafka-config.interface';

export const kafkaConfigSchema = Joi.object<KafkaConfig>({
    clientId: Joi.string().min(5).required().description('Client id for Kafka'),
    brokers: Joi.string()
        .required()
        .custom((value, helpers) => {
            const brokers = value.split(',').map((broker) => broker.trim());

            if (brokers.some((broker) => !/^.+:\d+$/.test(broker))) {
                return helpers.error('any.invalid', {
                    message: 'Each broker must be in the format host:port',
                });
            }

            return brokers;
        })
        .description(
            'Comma-separated list of Kafka brokers in the format host:port',
        ),
    groupId: Joi.string()
        .min(3)
        .required()
        .description('Consumer group ID for Kafka'),
    topics: Joi.object<KafkaConfigTopics>({
        notifications: Joi.string()
            .required()
            .min(5)
            .description('Topic name for notifications'),
    }),
    schemaRegistry: Joi.object<KafkaConfigSchemaRegistry>({
        url: Joi.string()
            .required()
            .uri()
            .description('Kafka schema registry URL'),
        username: Joi.string()
            .required()
            .min(3)
            .description('Kafka schema registry username'),
        password: Joi.string()
            .required()
            .min(3)
            .description('Kafka schema registry password'),
    }),
});
