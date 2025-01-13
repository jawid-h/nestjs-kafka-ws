import { ValidateNested } from 'class-validator';
import { UserListDto } from './user-list.dto';
import { Type } from 'class-transformer';

export class UserListResponseDto {
    @ValidateNested()
    @Type(() => UserListDto)
    object: UserListDto;
}
