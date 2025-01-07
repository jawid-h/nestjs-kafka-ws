import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsString, validate, ValidateNested } from 'class-validator';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';
import { IsValidDatabaseSource } from '../validators/database-source.validator';

export enum DatabaseSourceConnectionType {
    Mongodb = 'mongodb',
    Postgresql = 'postgresql',
}

export enum DatabaseEnabledSourceType {
    Mongoose = 'mongoose',
    Mikroorm = 'mikroorm',
}

export class DatabaseEnabledSource {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(DatabaseEnabledSourceType)
    type: DatabaseEnabledSourceType;

    constructor(enabledSource: string) {
        const [name, type] = enabledSource.split(':');

        this.name = name;
        this.type = type as DatabaseEnabledSourceType;
    }
}

export class DatabaseBaseSourceConfig {
    @IsString()
    @IsNotEmpty()
    connectionString: string;

    @IsString()
    @IsNotEmpty()
    databaseName: string;

    constructor(sourceName: string, env: Record<string, string>) {
        this.connectionString = env[`DATABASE_${sourceName.toUpperCase()}_CONNECTION_STRING`];
        this.databaseName = env[`DATABASE_${sourceName.toUpperCase()}_DATABASE_NAME`];
    }
}

export class DatabaseMikroormSourceConfig extends DatabaseBaseSourceConfig {
    @IsString()
    @IsNotEmpty()
    @IsEnum(DatabaseSourceConnectionType)
    connectionType: DatabaseSourceConnectionType;

    @IsArray()
    entityModules: string[];

    @IsArray()
    entityModulesTs: string[];

    constructor(sourceName: string, env: Record<string, string>) {
        super(sourceName, env);

        this.connectionType = env[`DATABASE_${sourceName.toUpperCase()}_CONNECTION_TYPE`] as DatabaseSourceConnectionType;

        const moduleNamesString = env[`DATABASE_${sourceName.toUpperCase()}_ENTITY_MODULES`];

        if (moduleNamesString !== undefined) {
            const moduleNames = moduleNamesString.split(',');

            this.entityModules = moduleNames.map((moduleName) => this.getEntityPath(moduleName, false));
            this.entityModulesTs = moduleNames.map((moduleName) => this.getEntityPath(moduleName, true));
        }
    }

    private getEntityPath(moduleName: string, isTypescript: boolean): string {
        return `./${isTypescript ? 'src' : 'dist'}/modules/${moduleName}/entities`;
    }
}

export class DatabaseMongooseSourceConfig extends DatabaseBaseSourceConfig {}

export class DatabaseConfig {
    @ValidateNested()
    @Type(() => DatabaseEnabledSource)
    enabledSources: DatabaseEnabledSource[];

    @IsValidDatabaseSource()
    sources: Record<string, DatabaseMikroormSourceConfig | DatabaseMongooseSourceConfig>;

    public static async fromEnv(env: Record<string, string>): Promise<DatabaseConfig> {
        const instance = new DatabaseConfig();

        instance.enabledSources = (env.DATABASE_ENABLED_SOURCES || '')
            .split(',')
            .map((source) => new DatabaseEnabledSource(source));

        instance.sources = instance.enabledSources.reduce((acc, enabledSource) => {
            const sourceName = enabledSource.name;

            if (enabledSource.type === DatabaseEnabledSourceType.Mikroorm) {
                acc[sourceName] = new DatabaseMikroormSourceConfig(sourceName, env);
            } else if (enabledSource.type === DatabaseEnabledSourceType.Mongoose) {
                acc[sourceName] = new DatabaseMongooseSourceConfig(sourceName, env);
            }

            return acc;
        }, {});

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('Database config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}

export const databaseConfig = registerAs('database', async (): Promise<DatabaseConfig> => DatabaseConfig.fromEnv(process.env));
