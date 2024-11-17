import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { NotificationMessage } from 'src/interfaces/notification.interface';

@WebSocketGateway({
    // TODO: should make it configurable?
    cors: {
        origin: '*', // TODO: Adjust for production
    },
})
export class NotificationsGateway {
    @WebSocketServer()
    server: any;

    constructor(
        @InjectPinoLogger(NotificationsGateway.name)
        private readonly logger: PinoLogger,
    ) {}

    broadcastNotification(notification: NotificationMessage) {
        try {
            this.logger.info(notification, 'broadcasting notification');
            this.server.emit('notification', notification);
        } catch (error) {
            this.logger.error(error, 'Error broadcasting notification');

            // TODO: should we notify the client of the error?
            // TODO: should we propagate the error?
        }
    }

    // TODO: should we use connection hooks?
}
