import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from 'src/database/validators/object-id.validator';

export class ReadNotificationWSDto {
    @IsObjectId()
    @IsNotEmpty()
    id: string;
}
