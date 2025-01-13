import { IsString, IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';

export class NotificationDto {
    @IsMongoId()
    id: string;

    @IsString()
    @IsNotEmpty()
    loanAppId: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    timer: string;

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsNumber()
    @IsNotEmpty()
    createdAt: number;

    @IsNumber()
    @IsNotEmpty()
    updatedAt: number;
}
