import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { QuerySortingInterface, SortingDirection } from '../../interfaces/query/query-sorting.interface';
import { QueryPath } from '../../types/query/query-path.type';
import { ApiProperty } from '@nestjs/swagger';

export class QuerySortingDto<T> implements QuerySortingInterface<T> {
    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
    path: QueryPath<T>;

    @ApiProperty({ enum: SortingDirection, required: true })
    @IsEnum(SortingDirection)
    direction: SortingDirection;
}
