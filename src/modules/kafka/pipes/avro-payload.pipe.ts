import { InjectSchemaRegistry } from '@goopen/nestjs-schema-registry';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AvroPayloadPipe implements PipeTransform<Buffer> {
    constructor(@InjectSchemaRegistry() private readonly schemaRegistry: SchemaRegistry) {}

    transform(value: Buffer): any {
        try {
            return this.schemaRegistry.decode(value);
        } catch (error) {
            throw new BadRequestException(`Failed to decode Kafka payload: ${error.message}`);
        }
    }
}
