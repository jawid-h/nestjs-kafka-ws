import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { UserRoleDto } from './user-role.dto';
import { Type } from 'class-transformer';

export class UserDto {
    @IsString()
    @IsNotEmpty()
    login: string;

    @ValidateNested({ each: true })
    @Type(() => UserRoleDto)
    roles: UserRoleDto[];
}
