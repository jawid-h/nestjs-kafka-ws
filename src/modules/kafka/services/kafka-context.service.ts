import { Injectable } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class KafkaContextService {
    constructor(
        @InjectPinoLogger(KafkaContextService.name)
        private readonly logger: PinoLogger,
    ) {}

    public async commitOffsets(context: KafkaContext) {
        const { offset } = context.getMessage();
        const partition = context.getPartition();
        const topic = context.getTopic();
        const consumer = context.getConsumer();

        this.logger.debug({ offset, partition, topic }, 'Committing offsets');

        await consumer.commitOffsets([{ topic, partition, offset }]);
    }
}
