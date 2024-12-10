import { Model } from 'mongoose';
import { CRUDRepositoryInterface } from '../interfaces/crud-repository.interface';
import { QueryDto } from '../dto/query/query.dto';
import { convertOperators } from '../utils/query/convert-operators';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export class CRUDMongooseRepository<T, ID>
    implements CRUDRepositoryInterface<T, ID, any>
{
    constructor(private readonly model: Model<T>) {}

    async findAll<U>(query: QueryDto<U>): Promise<T[]> {
        const filters = this.buildFilters(query);

        const options = {
            sort: this.buildSort(query),
            limit: query.size,
            skip: (query.page - 1) * query.size,
        };

        return this.model.find(filters, null, options).exec();
    }

    async findAllPaginated<U>(
        query: QueryDto<U>,
    ): Promise<PaginatedResponseDto<T>> {
        const filters = this.buildFilters(query);

        const options = {
            sort: this.buildSort(query),
            limit: query.size,
            skip: (query.page - 1) * query.size,
        };

        const data = await this.model.find(filters, null, options).exec();
        const totalCount = await this.model.countDocuments(filters).exec();

        return new PaginatedResponseDto(
            data,
            totalCount,
            query.page,
            query.size,
        );
    }

    async findOne(id: ID): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async create(data: Partial<T>): Promise<T> {
        const entity = new this.model(data);

        return entity.save() as unknown as T;
    }

    async update(id: ID, updateData: Partial<T>): Promise<T | null> {
        return this.model
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
    }

    async delete(id: ID): Promise<T | null> {
        const result = await this.model.findByIdAndDelete(id).exec();

        return result;
    }

    buildFilters<U>(query: QueryDto<U>): Record<string, any> {
        return query.filter?.reduce((result, filter) => {
            const filterByPath = result[filter.path as string] || {};

            result[filter.path as string] = {
                ...filterByPath,
                ...convertOperators(filter.operator, filter.value, 'mongo'),
            };

            return result;
        }, {});
    }

    buildSort<U>(query: QueryDto<U>): Record<string, any> {
        return query.sort?.reduce((result, sort) => {
            result[sort.path as string] = sort.direction === 'asc' ? 1 : -1;

            return result;
        }, {});
    }
}
