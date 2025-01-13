import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateNotificationUserMappingDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    login: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    role: string;
}

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    loanAppId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    timer: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    text: string;

    @ValidateNested({ each: true })
    @Type(() => CreateNotificationUserMappingDto)
    users: CreateNotificationUserMappingDto[];
}
