import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { KafkaTopicDecoratorProcessorService } from '../../../src/decorators/kafka-topic-decorator-processor.service';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { KafkaTopicFromConfig } from 'src/decorators/kafka-topic.decorator';
import { Reflector } from '@nestjs/core';

describe('KafkaTopicDecoratorProcessorService', () => {
    const reflector = new Reflector();

    let service: KafkaTopicDecoratorProcessorService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KafkaTopicDecoratorProcessorService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<KafkaTopicDecoratorProcessorService>(
            KafkaTopicDecoratorProcessorService,
        );
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should process kafka decorators', () => {
        class MockType {
            @KafkaTopicFromConfig('kafka.topics.notifications')
            testMethod() {}
        }

        jest.spyOn(configService, 'get').mockReturnValue('test-topic');

        service.processKafkaDecorators([MockType]);

        expect(configService.get).toHaveBeenCalledWith(
            'kafka.topics.notifications',
        );

        const eventPatternMetadata = reflector.get(
            PATTERN_METADATA,
            MockType.prototype.testMethod,
        );

        expect(eventPatternMetadata).toBeDefined();
        expect(eventPatternMetadata).toEqual(['test-topic']);
    });

    it('should not process if no metadata is found', () => {
        class MockType {
            testMethod() {}
        }

        service.processKafkaDecorators([MockType]);

        expect(configService.get).not.toHaveBeenCalled();
    });
});
