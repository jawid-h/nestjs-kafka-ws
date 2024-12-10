import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { QueryDto } from '../dto/query/query.dto';

export interface CRUDRepositoryInterface<T, ID, F> {
    findAll<U>(query: QueryDto<U>): Promise<T[]>;
    findAllPaginated<U>(query: QueryDto<U>): Promise<PaginatedResponseDto<T>>;
    findOne(id: ID): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: ID, updateData: Partial<T>): Promise<T | null>;
    delete(id: ID): Promise<T | null>;
    buildFilters<U>(query: QueryDto<U>): F;
    buildSort<U>(query: QueryDto<U>): Record<string, any>;
}
