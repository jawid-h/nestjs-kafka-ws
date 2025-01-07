import { Inject, Injectable, Optional } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ModelManager } from './model-manager';
import { MongooseEntity } from '../entities/base-mongoose.entity';
import { TypeOrmEntity } from '../entities/base-typeorm.entity';
import { CRUDRepositoryInterface } from '../interfaces/crud-repository.interface';
import { CRUDTypeOrmRepository } from './crud-typeorm.repository';
import { CRUDMikroOrmRepository } from './crud-mikroorm.repository';
import { CRUDMongooseRepository } from './crud-mongoose.repository';
import { PROVIDER_MIKRO_ORM, PROVIDER_MONGOOSE, PROVIDER_TYPE_ORM } from '../constants/providers.constants';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmMongoEntity } from '../entities/base-mongo-mikroorm.entity';
import { MikroOrmPostgresqlEntity } from '../entities/base-postgresql-mikroorm.entity';

@Injectable()
export class RepositoryManager {
    constructor(
        @Optional()
        @Inject(PROVIDER_TYPE_ORM)
        private readonly typeormDataSource?: DataSource,
        @Optional()
        @Inject(PROVIDER_MIKRO_ORM)
        private readonly orm?: MikroORM,
        @Optional()
        @Inject(PROVIDER_MONGOOSE)
        private readonly modelManager?: ModelManager<any>,
    ) {}

    getRepository<T extends object>(entity: { new (): T }): CRUDRepositoryInterface<T, any, any> {
        if (entity.prototype instanceof TypeOrmEntity) {
            if (!this.typeormDataSource) {
                throw new Error('TypeORM DataSource is required for TypeORM entities');
            }

            return new CRUDTypeOrmRepository(this.typeormDataSource.getRepository(entity));
        } else if (entity.prototype instanceof MikroOrmMongoEntity || entity.prototype instanceof MikroOrmPostgresqlEntity) {
            if (!this.orm) {
                throw new Error('MikroORM is required for MikroORM entities');
            }

            return new CRUDMikroOrmRepository(this.orm, entity);
        } else if (entity.prototype instanceof MongooseEntity) {
            if (!this.modelManager) {
                throw new Error('ModelManager is required for Mongoose entities');
            }

            const model = this.modelManager.getModel(entity.name);

            return new CRUDMongooseRepository(model);
        } else {
            throw new Error(`Unsupported entity type: ${entity}`);
        }
    }
}
