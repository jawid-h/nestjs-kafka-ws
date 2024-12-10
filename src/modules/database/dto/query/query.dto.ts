import { Type } from 'class-transformer';
import {
    IsOptional,
    IsInt,
    IsArray,
    Min,
    ValidateNested,
} from 'class-validator';
import { BaseQueryInterface } from '../../interfaces/query/base-query.interface';
import { QueryFilterDto } from './query-filter.dto';
import { QuerySortingDto } from './query-sorting.dto';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto<T> implements BaseQueryInterface<T> {
    @ApiProperty({ isArray: true, type: QueryFilterDto, required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QueryFilterDto)
    filter?: QueryFilterDto<T>[];

    @ApiProperty({ isArray: true, type: QuerySortingDto, required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuerySortingDto)
    sort?: QuerySortingDto<T>[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    size?: number;
}
