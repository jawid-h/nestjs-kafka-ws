import { Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Ctx, KafkaContext, Payload } from '@nestjs/microservices';
import { KafkaTopicFromConfig } from 'src/kafka/decorators/kafka-topic.decorator';
import { NotificationsService } from '../services/notifications.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { I18nService } from 'nestjs-i18n';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationDto } from '../dtos/notification.dto';
import { QueryDto } from 'src/database/dto/query/query.dto';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { ObjectId } from 'mongodb';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/database/pipes/object-id.pipe';
import { KafkaContextService } from 'src/kafka/services/kafka-context.service';
import { PaginatedResponseDto } from 'src/database/dto/paginated-response.dto';
import { NotificationsGateway } from '../notifications.gateway';
import { AuthenticatedUser, AuthGuard } from 'nest-keycloak-connect';
import { KeycloackAuthenticatedUser } from 'src/auth/types/authenticated-user.type';

@Controller('notifications')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService,
        private readonly kafkaContextService: KafkaContextService,
        private readonly notificationsGateway: NotificationsGateway,
        @InjectPinoLogger(NotificationsController.name)
        private readonly logger: PinoLogger,
        private readonly i18n: I18nService,
    ) {}

    @Post('list')
    @ApiResponse({ type: PaginatedResponseDto })
    async list(@Payload() query: QueryDto<NotificationDto>): Promise<PaginatedResponseDto<NotificationEntity>> {
        return this.notificationService.findAllPaginated(query);
    }

    @Get('unread')
    async getUnreadNotifications(@AuthenticatedUser() user: KeycloackAuthenticatedUser): Promise<NotificationEntity[]> {
        const username = user?.preferred_username;

        return this.notificationService.findUnread(username);
    }

    @Put(':id/read')
    @ApiParam({ name: 'id', type: String })
    async markRead(@Param('id', ParseObjectIdPipe) id: ObjectId, @AuthenticatedUser() user: KeycloackAuthenticatedUser) {
        const username = user?.preferred_username;

        return this.notificationService.markRead(id, username);
    }

    @KafkaTopicFromConfig('notifications.kafkaTopics.notifications')
    async onNotificationReceived(@Payload() notification: CreateNotificationDto, @Ctx() kafkaContext: KafkaContext) {
        const createdNotification = await this.notificationService.populateAndCreateNotification(notification);

        await this.kafkaContextService.commitOffsets(kafkaContext);

        await this.notificationsGateway.broadcastNotification(createdNotification);
    }
}
