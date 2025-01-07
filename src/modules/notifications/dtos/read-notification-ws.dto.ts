import { IsNotEmpty } from 'class-validator';
import { ReadNotificationDto } from './read-notification.dto';
import { IsObjectId } from 'src/modules/database/validators/object-id.validator';

export class ReadNotificationWSDto extends ReadNotificationDto {
    @IsObjectId()
    @IsNotEmpty()
    id: string;
}