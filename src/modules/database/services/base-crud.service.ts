import { PinoLogger } from 'nestjs-pino';
import { QueryDto } from '../dto/query/query.dto';
import { CRUDRepositoryInterface } from '../interfaces/crud-repository.interface';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export abstract class BaseCRUDService<T, ID> {
    constructor(
        private readonly repository: CRUDRepositoryInterface<T, ID, any>,
        readonly logger: PinoLogger,
    ) {}

    async findAll<U>(query: QueryDto<U>): Promise<T[]> {
        this.logger.debug({ query }, 'searching for all entities with query');

        return this.repository.findAll(query);
    }

    async findAllPaginated<U>(
        query: QueryDto<U>,
    ): Promise<PaginatedResponseDto<T>> {
        this.logger.debug(
            { query },
            'searching for all entities (paginated) with query',
        );

        return this.repository.findAllPaginated(query);
    }

    async findOne(id: ID): Promise<T | null> {
        this.logger.debug({ id }, 'searching for one entity with id');

        return this.repository.findOne(id);
    }

    async create(data: Partial<T>): Promise<T> {
        this.logger.debug({ entity: data }, 'creating an entity');

        return this.repository.create(data);
    }

    async update(id: ID, updateData: Partial<T>): Promise<T | null> {
        this.logger.debug({ entity: updateData, id }, 'updating an entity');

        return this.repository.update(id, updateData);
    }

    async delete(id: ID): Promise<T | null> {
        this.logger.debug({ id }, 'deleting an entity');

        return this.repository.delete(id);
    }
}
