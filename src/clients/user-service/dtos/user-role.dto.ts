import { IsNotEmpty, IsString } from 'class-validator';

export class UserRoleDto {
    @IsString()
    @IsNotEmpty()
    alias: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
