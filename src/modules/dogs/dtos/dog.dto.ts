import { ApiProperty } from '@nestjs/swagger';

export class DogDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    age: number;
}
