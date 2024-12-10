import { EntityRepository, FilterQuery, MikroORM } from '@mikro-orm/core';
import { CRUDRepositoryInterface } from '../interfaces/crud-repository.interface';
import { QueryDto } from '../dto/query/query.dto';
import { FilterOperator } from '../interfaces/query/query-filter.interface';
import { convertOperators } from '../utils/query/convert-operators';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export class CRUDMikroOrmRepository<T extends object, ID>
    implements CRUDRepositoryInterface<T, ID, FilterQuery<T>>
{
    private repository: EntityRepository<T>;
    private em;

    constructor(
        private readonly orm: MikroORM,
        private readonly entityClass: { new (): T },
    ) {
        this.em = this.orm.em.fork();
        this.repository = this.em.getRepository(this.entityClass);
    }

    async findAll<U>(queryDto: QueryDto<U>): Promise<T[]> {
        const filters = this.buildFilters(queryDto);

        const options: any = {
            where: filters,
            orderBy: this.buildSort(queryDto),
            limit: queryDto.size,
            offset: (queryDto.page - 1) * queryDto.size,
        };

        return this.repository.findAll(options);
    }

    async findAllPaginated<U>(
        queryDto: QueryDto<U>,
    ): Promise<PaginatedResponseDto<T>> {
        const filters = this.buildFilters(queryDto);

        const options: any = {
            orderBy: this.buildSort(queryDto),
            limit: queryDto.size,
            offset: (queryDto.page - 1) * queryDto.size,
        };

        const [data, count] = await this.repository.findAndCount(
            filters,
            options,
        );

        return new PaginatedResponseDto(
            data,
            count,
            queryDto.page,
            queryDto.size,
        );
    }

    async findOne(id: ID): Promise<T | null> {
        return this.repository.findOne(id);
    }

    async create(data: Partial<T>): Promise<T> {
        const entity = this.repository.create(data as T);
        await this.em.persistAndFlush(entity);
        return entity;
    }

    async update(id: ID, updateData: Partial<T>): Promise<T | null> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            return null;
        }
        this.repository.assign(entity, updateData as any);
        await this.em.flush();
        return entity;
    }

    async delete(id: ID): Promise<T | null> {
        const entity = await this.repository.findOne(id);

        if (!entity) {
            return null;
        }

        await this.em.removeAndFlush(entity);

        return entity;
    }

    transformOperator(operator: FilterOperator): string {
        if (operator === FilterOperator.LIKE) {
            return '$regex';
        }
    }

    buildFilters<U>(query: QueryDto<U>): FilterQuery<T> {
        return query.filter?.reduce((result, filter) => {
            const filterByPath = result[filter.path as string] || {};

            // TODO: is there a better way?
            const dbType =
                this.orm.config.get('driver').name == 'MongoDriver'
                    ? 'mongo'
                    : 'postgres';

            result[filter.path as string] = {
                ...filterByPath,
                ...convertOperators(filter.operator, filter.value, dbType),
            };

            return result;
        }, {});
    }

    buildSort<U>(query: QueryDto<U>): Record<string, any> {
        return query.sort?.reduce((result, sort) => {
            result[sort.path as string] = sort.direction;
            return result;
        }, {});
    }
}
