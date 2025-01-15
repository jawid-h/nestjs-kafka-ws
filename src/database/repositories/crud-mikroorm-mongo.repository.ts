import { FilterQuery, MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { CRUDRepositoryInterface } from '../interfaces/crud-repository.interface';
import { QueryDto } from '../dto/query/query.dto';
import { FilterOperator } from '../interfaces/query/query-filter.interface';
import { convertOperators } from '../utils/query/convert-operators';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { isEntityHaveRelations } from '../utils/mikroorm/mongo-relations';
import { RelationalSearchAggregationPipeline } from '../utils/mikroorm/relational-search-aggregation-pipeline';
import { Logger } from '@nestjs/common';

export class CRUDMikroOrmMongoRepository<T extends object, ID> implements CRUDRepositoryInterface<T, ID, FilterQuery<T>> {
    private repository: EntityRepository<T>;
    private em;
    logger: Logger;

    constructor(
        private readonly orm: MikroORM,
        private readonly entityClass: { new (): T },
    ) {
        this.em = this.orm.em.fork();
        this.repository = this.em.getRepository(this.entityClass);
        this.logger = new Logger(CRUDMikroOrmMongoRepository.name);
    }

    private async findAllAggregated<U>(queryDto: QueryDto<U>): Promise<T[]> {
        const filters = this.buildFilters(queryDto);
        const orderBy = this.buildSort(queryDto);

        const pipelineBuilder = new RelationalSearchAggregationPipeline<T>(this.entityClass, this.em);

        pipelineBuilder.addFilter(filters);
        pipelineBuilder.addOrderBy(orderBy);
        pipelineBuilder.addPagination(queryDto.size, queryDto.page);

        const pipeline = pipelineBuilder.getPipeline();

        return this.repository.aggregate(pipeline);
    }

    private async findAllPaginatedAggregated<U>(queryDto: QueryDto<U>): Promise<PaginatedResponseDto<T>> {
        const filters = this.buildFilters(queryDto);
        const orderBy = this.buildSort(queryDto);

        const pipelineBuilder = new RelationalSearchAggregationPipeline<T>(this.entityClass, this.em);

        pipelineBuilder.addFilter(filters);
        pipelineBuilder.addOrderBy(orderBy);
        pipelineBuilder.addPagination(queryDto.size, queryDto.page);

        const pipeline = pipelineBuilder.getPipelineWithCount();

        this.logger.debug(`Aggregation pipeline: ${JSON.stringify(pipeline, null, 2)}`);

        const [{ results, totalCount }] = await this.repository.aggregate(pipeline);

        return new PaginatedResponseDto(results, totalCount, queryDto.page, queryDto.size);
    }

    private async findAllSimple<U>(queryDto: QueryDto<U>): Promise<T[]> {
        const filters = this.buildFilters(queryDto);

        const options: any = {
            where: filters,
            orderBy: this.buildSort(queryDto),
            limit: queryDto.size,
            offset: (queryDto.page - 1) * queryDto.size,
        };

        return this.repository.findAll(options);
    }

    private async findAllPaginatedSimple<U>(queryDto: QueryDto<U>): Promise<PaginatedResponseDto<T>> {
        const filters = this.buildFilters(queryDto);

        const options: any = {
            orderBy: this.buildSort(queryDto),
            limit: queryDto.size,
            offset: (queryDto.page - 1) * queryDto.size,
        };

        const [data, count] = await this.repository.findAndCount(filters, options);

        return new PaginatedResponseDto(data, count, queryDto.page, queryDto.size);
    }

    async findAll<U>(queryDto: QueryDto<U>): Promise<T[]> {
        if (isEntityHaveRelations<T>(this.entityClass, this.em)) {
            return this.findAllAggregated(queryDto);
        }

        return this.findAllSimple(queryDto);
    }

    async findAllPaginated<U>(queryDto: QueryDto<U>): Promise<PaginatedResponseDto<T>> {
        if (isEntityHaveRelations<T>(this.entityClass, this.em)) {
            return this.findAllPaginatedAggregated(queryDto);
        }

        return this.findAllPaginatedSimple(queryDto);
    }

    async findOne(id: ID): Promise<T | null> {
        return this.repository.findOne(id, { populate: '*' } as any);
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
        if (!query.filter) {
            return {};
        }

        return query.filter?.reduce((result, filter) => {
            const filterByPath = result[filter.path as string] || {};

            result[filter.path as string] = {
                ...filterByPath,
                ...convertOperators(filter.operator, filter.value === 'null' ? null : filter.value, 'mongo'),
            };

            return result;
        }, {});
    }

    buildSort<U>(query: QueryDto<U>): Record<string, any> | null {
        if (!query.sort) {
            return null;
        }

        return query.sort?.reduce((result, sort) => {
            result[sort.path as string] = sort.direction;
            return result;
        }, {});
    }
}
