import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../../../src/notifications/notifications.service';
import { NotificationsGateway } from '../../../src/notifications/notifications.gateway';
import { NotificationMessage } from '../../../src/interfaces/notification.interface';

describe('NotificationsService', () => {
    let service: NotificationsService;
    let gateway: NotificationsGateway;

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    const mockGateway = {
        broadcastNotification: jest.fn(),
    };

    beforeEach(async () => {
        const loggerToken = 'PinoLogger:NotificationsService';

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsService,
                {
                    provide: loggerToken,
                    useValue: mockLogger,
                },
                {
                    provide: NotificationsGateway,
                    useValue: mockGateway,
                },
            ],
        }).compile();

        service = module.get<NotificationsService>(NotificationsService);
        gateway = module.get<NotificationsGateway>(NotificationsGateway);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should log and broadcast notification', async () => {
        const notificationMessage: NotificationMessage = {
            id: '1',
            title: 'Test Title',
            body: 'Test message',
        };

        await service.processNotification(notificationMessage);

        expect(mockLogger.info).toHaveBeenCalledWith(
            notificationMessage,
            'received notification message',
        );
        expect(gateway.broadcastNotification).toHaveBeenCalledWith(
            notificationMessage,
        );
    });
});
