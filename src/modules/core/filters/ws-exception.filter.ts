import { ArgumentsHost, Catch, ExceptionFilter, BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Socket } from 'net';

@Injectable()
@Catch()
export class WsExceptionFilter implements ExceptionFilter {
    constructor(
        @InjectPinoLogger(WsExceptionFilter.name)
        private readonly logger: PinoLogger,
    ) {}

    catch(exception: unknown, host: ArgumentsHost) {
        this.logger.error({ exception }, 'An error occurred during the handling of a WebSocket event');

        const ctx = host.switchToWs();
        const client: Socket = ctx.getClient<Socket>();
        const data = ctx.getData(); // Retrieve the event data (original topic)

        // Determine the error response
        let message: string;
        let details: any = null;

        if (exception instanceof WsException) {
            message = exception.message;
        } else if (exception instanceof BadRequestException) {
            const response = exception.getResponse();
            message = response['message'] || 'Validation failed';
            details = response['details'] || null;
        } else {
            message = 'Internal server error';
        }

        // Emit the error to the client on a specific topic
        client.emit('error', {
            event: data.event || 'unknown', // Original topic name
            message,
            details,
        });
    }
}
