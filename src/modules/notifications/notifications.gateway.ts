import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationsService } from './services/notifications.service';
import {
    TOPIC_NOTIFICATION_LIST,
    TOPIC_NOTIFICATION_LIST_RESPONSE,
    TOPIC_NOTIFICATION_MARK_READ,
    TOPIC_NOTIFICATION_MARK_READ_RESPONSE,
    TOPIC_NOTIFICATION_RECEIVED,
} from './constants/ws.constants';
import { QueryDto } from '../../database/dto/query/query.dto';
import { NotificationDto } from './dtos/notification.dto';
import { ReadNotificationWSDto } from './dtos/read-notification-ws.dto';
import { ObjectId } from 'mongodb';
import { Socket } from 'net';
import { UseFilters, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from '../../core/filters/ws-exception.filter';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseFilters(WsExceptionFilter)
export class NotificationsGateway {
    @WebSocketServer()
    server: any;

    constructor(
        private readonly notificationsService: NotificationsService,
        @InjectPinoLogger(NotificationsGateway.name)
        private readonly logger: PinoLogger,
    ) {}

    @SubscribeMessage(TOPIC_NOTIFICATION_LIST)
    async getNotificationList(
        @MessageBody(new ValidationPipe({ transform: true }))
        query: QueryDto<NotificationDto>,
        @ConnectedSocket() client: Socket,
    ) {
        this.logger.debug({ query }, 'searching for all notifications with query');

        const result = await this.notificationsService.findAll(query);

        client.emit(TOPIC_NOTIFICATION_LIST_RESPONSE, result);
    }

    @SubscribeMessage(TOPIC_NOTIFICATION_MARK_READ)
    async markRead(
        @MessageBody(new ValidationPipe({ transform: true }))
        data: ReadNotificationWSDto,
        @ConnectedSocket() client: Socket,
    ) {
        this.logger.debug({ data }, 'marking notification as read');

        const result = await this.notificationsService.update(ObjectId.createFromHexString(data.id), { isRead: true });

        client.emit(TOPIC_NOTIFICATION_MARK_READ_RESPONSE, result);
    }

    broadcastNotification(notification: NotificationEntity) {
        this.logger.info({ notification }, 'broadcasting notification');

        this.server.emit(TOPIC_NOTIFICATION_RECEIVED, notification);
    }
}
