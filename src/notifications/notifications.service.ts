import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationMessage } from 'src/interfaces/notification.interface';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectPinoLogger(NotificationsService.name)
        private readonly logger: PinoLogger,
        private readonly notificationGateway: NotificationsGateway,
    ) {}

    async processNotification(notificationMessage: NotificationMessage) {
        this.logger.info(notificationMessage, 'received notification message');

        this.notificationGateway.broadcastNotification(notificationMessage);
    }
}
