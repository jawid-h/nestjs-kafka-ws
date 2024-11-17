import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsGateway } from '../../../src/notifications/notifications.gateway';
import { NotificationMessage } from '../../../src/interfaces/notification.interface';

describe('NotificationsGateway', () => {
    let gateway: NotificationsGateway;

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    const mockServer = {
        emit: jest.fn(),
    };

    beforeEach(async () => {
        const loggerToken = 'PinoLogger:NotificationsGateway';

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsGateway,
                {
                    provide: 'WebSocketServer',
                    useValue: mockServer,
                },
                {
                    provide: loggerToken,
                    useValue: mockLogger,
                },
            ],
        }).compile();

        gateway = module.get<NotificationsGateway>(NotificationsGateway);
        gateway.server = mockServer;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });

    it('should log and emit notification', () => {
        const notificationMessage: NotificationMessage = {
            id: '1',
            title: 'Test Title',
            body: 'Test message',
        };

        gateway.broadcastNotification(notificationMessage);

        expect(mockLogger.info).toHaveBeenCalledWith(
            notificationMessage,
            'broadcasting notification',
        );
        expect(mockServer.emit).toHaveBeenCalledWith(
            'notification',
            notificationMessage,
        );
    });

    it('should log an error if broadcasting notification fails', () => {
        const notificationMessage: NotificationMessage = {
            id: '1',
            title: 'Test Title',
            body: 'Test message',
        };

        const error = new Error('Broadcast failed');
        mockServer.emit.mockImplementation(() => {
            throw error;
        });

        gateway.broadcastNotification(notificationMessage);

        expect(mockLogger.info).toHaveBeenCalledWith(
            notificationMessage,
            'broadcasting notification',
        );
        expect(mockLogger.error).toHaveBeenCalledWith(
            error,
            'Error broadcasting notification',
        );
    });
});
