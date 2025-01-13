import { ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';
import { Type } from 'class-transformer';

export class UserListDto {
    @ValidateNested({ each: true })
    @Type(() => UserDto)
    items: UserDto[];
}
