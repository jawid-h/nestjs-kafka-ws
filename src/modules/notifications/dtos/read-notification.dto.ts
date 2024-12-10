import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ReadNotificationDto {
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    isRead: boolean;
}
