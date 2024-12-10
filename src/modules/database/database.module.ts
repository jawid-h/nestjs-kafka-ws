import { Module } from '@nestjs/common';
import { RepositoryManager } from './repositories/repository-manager';
import { DataSource } from 'typeorm';
import {
    PROVIDER_MIKRO_ORM,
    PROVIDER_MONGOOSE,
    PROVIDER_TYPE_ORM,
} from './constants/providers.constants';
import { MikroORM } from '@mikro-orm/core';
import { ModelManager } from './repositories/model-manager';
import { getMikroORMToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

type DatabaseTypeORMOptions = object;

type DatabaseMikroORMOptions = {
    entities: any[];
    contextName: string;
};

type DatabaseMongooseOptions = {
    entities: { entity: any; schema: any }[];
    connectionName: string;
    modelManagerFactory: (...models) => ModelManager<any>;
};

type DatabaseModuleOptions = {
    mikroORMOptions?: DatabaseMikroORMOptions;
    mongooseOptions?: DatabaseMongooseOptions;
    typeORMOptions?: DatabaseTypeORMOptions;
};

@Module({})
export class DatabaseModule {
    public static forFeature(options: DatabaseModuleOptions) {
        const providers = [];
        const imports = [];
        const exports = [];

        if (options.typeORMOptions) {
            providers.push({
                provide: PROVIDER_TYPE_ORM,
                useFactory: (dataSource: DataSource) => dataSource,
                inject: [DataSource],
            });
        }

        if (options.mikroORMOptions) {
            const { entities, contextName } = options.mikroORMOptions;

            const mikroOrmModule = MikroOrmModule.forFeature(
                entities,
                contextName,
            );

            imports.push(mikroOrmModule);
            exports.push(mikroOrmModule);

            providers.push({
                provide: PROVIDER_MIKRO_ORM,
                useFactory: (orm: MikroORM) => orm,
                inject: [getMikroORMToken(contextName)],
            });
        }

        if (options.mongooseOptions) {
            const { entities, connectionName, modelManagerFactory } =
                options.mongooseOptions;

            const entityDefinitions = entities.map((e) => {
                return {
                    name: e.entity.name,
                    schema: e.schema,
                };
            });

            const inject = entityDefinitions.map((e) =>
                getModelToken(e.name, connectionName),
            );

            const mongooseModule = MongooseModule.forFeature(
                entityDefinitions,
                connectionName,
            );

            imports.push(mongooseModule);
            exports.push(mongooseModule);

            providers.push({
                provide: PROVIDER_MONGOOSE,
                useFactory: modelManagerFactory,
                inject,
            });
        }

        providers.push(RepositoryManager);
        exports.push(RepositoryManager);

        const module = {
            imports,
            providers,
            exports,
            module: DatabaseModule,
        };

        return module;
    }
}
