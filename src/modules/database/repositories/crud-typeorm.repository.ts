import { DeepPartial, Repository } from 'typeorm';
import { CRUDRepositoryInterface } from '../interfaces/crud-repository.interface';
import { QueryDto } from '../dto/query/query.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export class CRUDTypeOrmRepository<T, ID>
    implements CRUDRepositoryInterface<T, ID, any>
{
    constructor(private readonly repository: Repository<T>) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findAll<U>(query: QueryDto<U>): Promise<T[]> {
        return [];
    }

    async findAllPaginated<U>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        query: QueryDto<U>,
    ): Promise<PaginatedResponseDto<T>> {
        return new PaginatedResponseDto<T>([], 0, 0, 0);
    }

    async findOne(id: ID): Promise<T | null> {
        return this.repository.findOneBy({ id } as any);
    }

    async create(data: Partial<T>): Promise<T> {
        const entity = this.repository.create(data as DeepPartial<T>);
        return this.repository.save(entity as any);
    }

    async update(id: ID, updateData: Partial<T>): Promise<T | null> {
        const entity = await this.repository.findOneBy({ id } as any);
        if (!entity) {
            return null;
        }
        return this.repository.save({ ...entity, ...updateData });
    }

    async delete(id: ID): Promise<T | null> {
        const entity = await this.repository.findOneBy({ id } as any);

        if (!entity) {
            return null;
        }

        await this.repository.delete(id as any);

        return entity;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildFilters<U>(query: QueryDto<U>) {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildSort<U>(query: QueryDto<U>): Record<string, any> {
        throw new Error('Method not implemented.');
    }
}
