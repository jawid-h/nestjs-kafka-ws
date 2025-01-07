import { SchemaRegistryModule } from '@goopen/nestjs-schema-registry';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaConfig } from './config/kafka.config';
import { KafkaTopicDecoratorProcessorService } from './services/kafka-topic-decorator-processor.service';
import { KafkaContextService } from './services/kafka-context.service';

@Module({
    imports: [
        SchemaRegistryModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const kafkaConfig = configService.get<KafkaConfig>('kafka');

                return {
                    host: kafkaConfig.schemaRegistry.url,
                    auth: {
                        username: kafkaConfig.schemaRegistry.username,
                        password: kafkaConfig.schemaRegistry.password,
                    },
                };
            },
        }),
    ],
    providers: [KafkaTopicDecoratorProcessorService, KafkaContextService],
    exports: [SchemaRegistryModule, KafkaTopicDecoratorProcessorService, KafkaContextService],
})
export class KafkaModule {}
