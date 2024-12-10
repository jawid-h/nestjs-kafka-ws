import { ApiProperty } from '@nestjs/swagger';
import {
    FilterOperator,
    QueryFilterInterface,
} from '../../interfaces/query/query-filter.interface';
import { QueryPath } from '../../types/query/query-path.type';
import { QueryValue } from '../../types/query/query-value.type';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class QueryFilterDto<T> implements QueryFilterInterface<T> {
    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @IsString()
    path: QueryPath<T>;

    @ApiProperty({ enum: FilterOperator, required: true })
    @IsEnum(FilterOperator)
    operator: FilterOperator;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    value: QueryValue<T, QueryPath<T>>;
}
