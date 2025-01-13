import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { NotificationEntity } from '../entities/notification.entity';
import { RepositoryManager } from 'src/database/repositories/repository-manager';
import { BaseCRUDService } from 'src/database/services/base-crud.service';
import { ObjectId } from '@mikro-orm/mongodb';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { UserServiceClientService } from '../../../clients/user-service/services/user-service-client.service';
import { UserDto } from 'src/clients/user-service/dtos/user.dto';
import { NotificationReadEntryEntity } from '../entities/notification-read-entry.entity';

@Injectable()
export class NotificationsService extends BaseCRUDService<NotificationEntity, ObjectId> {
    constructor(
        private readonly repositoryManager: RepositoryManager,
        @InjectPinoLogger(NotificationsService.name)
        readonly logger: PinoLogger,
        readonly userServicesClient: UserServiceClientService,
    ) {
        super(repositoryManager.getRepository(NotificationEntity), logger);
    }

    public async populateAndCreateNotification(data: CreateNotificationDto): Promise<NotificationEntity> {
        // We need to gather the list of usernames that are passed through 
        // Then we need to receive list of all usernames if only role is passed
        // Then we need to combine those removing duplicates
        const usernamesPassed: string[] = data.users
            .filter((user) => user.login !== undefined && user.login !== null && user.login !== '')
            .map((user) => user.login);

        const emptyUsernamesRoles: string[] = data.users
            .filter((user) => user.login === undefined || user.login === null || user.login !== '')
            .map((user) => user.role);

        const usernListsByRole: UserDto[][] = await Promise.all(
            emptyUsernamesRoles.map((role) => this.userServicesClient.getUsersByRole(role)),
        );

        const usernamesByRole: string[] = usernListsByRole
            .reduce((usernames: string[], userList: UserDto[]) => usernames.concat(userList.map((user) => user.login)), []);

        const resultUsernames: Set<string> = new Set([...usernamesPassed, ...usernamesByRole]);

        const notification = new NotificationEntity();

        notification.loanAppId = data.loanAppId;
        notification.status = data.status;
        notification.timer = data.timer;
        notification.text = data.text;

        resultUsernames.forEach((username) => {
            const readEntry = new NotificationReadEntryEntity();
            readEntry.username = username;
            readEntry.readAt = null;

            notification.readsEntries.add(readEntry);
        });

        await this.create(notification);

        return notification;
    }
}
