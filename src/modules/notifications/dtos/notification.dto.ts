import {
    IsString,
    IsNotEmpty,
    IsMongoId,
    IsBoolean,
    IsNumber,
} from 'class-validator';

export class NotificationDto {
    @IsMongoId()
    id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsNumber()
    test: number;

    @IsBoolean()
    isRead: boolean;

    @IsNumber()
    @IsNotEmpty()
    createdAt: number;

    @IsNumber()
    @IsNotEmpty()
    updatedAt: number;
}
