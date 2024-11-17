// notifications.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SCHEMA_REGISTRY_CLIENT } from '@goopen/nestjs-schema-registry'; // Import the symbol
import { KafkaContext } from '@nestjs/microservices';
import { NotificationsController } from 'src/notifications/notifications.controller';
import { NotificationsService } from 'src/notifications/notifications.service';

describe('NotificationsController', () => {
    let controller: NotificationsController;
    let kafkaContext: KafkaContext;

    const mockNotificationsService = {
        processNotification: jest.fn(),
    };

    const mockSchemaRegistry = {
        decode: jest.fn(),
    };

    const mockLogger = {
        error: jest.fn(),
        info: jest.fn(),
    };

    beforeEach(async () => {
        const loggerToken = 'PinoLogger:NotificationsController';

        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [
                {
                    provide: NotificationsService,
                    useValue: mockNotificationsService,
                },
                {
                    provide: SCHEMA_REGISTRY_CLIENT,
                    useValue: mockSchemaRegistry,
                },
                {
                    provide: loggerToken,
                    useValue: mockLogger,
                },
            ],
        }).compile();

        controller = module.get<NotificationsController>(
            NotificationsController,
        );

        kafkaContext = {
            getMessage: jest.fn().mockReturnValue({ offset: '10' }),
            getPartition: jest.fn().mockReturnValue(0),
            getTopic: jest.fn().mockReturnValue('test-topic'),
            getConsumer: jest.fn().mockReturnValue({
                commitOffsets: jest.fn(),
            }),
        } as unknown as KafkaContext;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should process notification and commit offset on success', async () => {
        const notificationMessageBuffer = Buffer.from('mock message');
        const decodedMessage = {
            id: '123',
            type: 'test',
            content: 'Test content',
        };

        mockSchemaRegistry.decode.mockResolvedValue(decodedMessage);

        await controller.onNotificationReceived(
            notificationMessageBuffer,
            kafkaContext,
        );

        expect(mockSchemaRegistry.decode).toHaveBeenCalledWith(
            notificationMessageBuffer,
        );
        expect(
            mockNotificationsService.processNotification,
        ).toHaveBeenCalledWith(decodedMessage);
        expect(kafkaContext.getConsumer().commitOffsets).toHaveBeenCalledWith([
            { topic: 'test-topic', partition: 0, offset: '10' },
        ]);
    });

    it('should log an error when decoding fails', async () => {
        const notificationMessageBuffer = Buffer.from('mock message');
        const error = new Error('Decoding failed');

        mockSchemaRegistry.decode.mockRejectedValue(error);

        await controller.onNotificationReceived(
            notificationMessageBuffer,
            kafkaContext,
        );

        expect(
            mockNotificationsService.processNotification,
        ).not.toHaveBeenCalled();
        expect(mockLogger.error).toHaveBeenCalledWith(
            error,
            'Error processing notification message from Kafka',
        );
        expect(kafkaContext.getConsumer().commitOffsets).not.toHaveBeenCalled();
    });
});
