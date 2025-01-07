import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
    @ApiProperty({ example: 1, description: 'Current page number' })
    page: number;

    @ApiProperty({ example: 10, description: 'Number of items per page' })
    size: number;

    @ApiProperty({ example: 100, description: 'Total number of items' })
    total: number;

    @ApiProperty({ description: 'Paginated items', isArray: true })
    data: T[];

    constructor(data: T[], total: number, page: number, size: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.size = size;
    }
}
