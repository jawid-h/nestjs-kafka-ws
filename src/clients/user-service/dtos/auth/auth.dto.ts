import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
