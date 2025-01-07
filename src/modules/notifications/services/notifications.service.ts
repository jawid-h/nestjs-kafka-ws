import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { NotificationEntity } from '../entities/notification.entity';
import { RepositoryManager } from 'src/modules/database/repositories/repository-manager';
import { BaseCRUDService } from 'src/modules/database/services/base-crud.service';
import { ObjectId } from '@mikro-orm/mongodb';

@Injectable()
export class NotificationsService extends BaseCRUDService<NotificationEntity, ObjectId> {
    constructor(
        private readonly repositoryManager: RepositoryManager,
        @InjectPinoLogger(NotificationsService.name)
        readonly logger: PinoLogger,
    ) {
        super(repositoryManager.getRepository(NotificationEntity), logger);
    }
}
