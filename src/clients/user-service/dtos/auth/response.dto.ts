import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AuthDto } from './auth.dto';

export class AuthResponseDto {
    @ValidateNested()
    @Type(() => AuthDto)
    object: AuthDto;
}
