import { SchemaRegistryModule } from '@goopen/nestjs-schema-registry';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaConfig } from './config/kafka.config';
import { KafkaTopicDecoratorProcessorService } from './services/kafka-topic-decorator-processor.service';
import { KafkaContextService } from './services/kafka-context.service';

export interface KafkaModuleOptions {
    useSchemaRegistry: boolean;
}

@Module({})
export class KafkaModule {
    static register(options: KafkaModuleOptions) {
        const imports = [];
        const providers = [
            KafkaTopicDecoratorProcessorService,
            KafkaContextService,
        ];

        const exports: any[] = [
            KafkaTopicDecoratorProcessorService,
            KafkaContextService,
        ];

        if (options.useSchemaRegistry) {
            imports.push(SchemaRegistryModule.registerAsync({
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
            }));

            exports.push(SchemaRegistryModule);
        }

        return {
            module: KafkaModule,
            imports,
            providers,
            exports,
        };
    }
}
