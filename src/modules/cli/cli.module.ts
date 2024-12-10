import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { Module } from '@nestjs/common';
import { MigrationCommand } from '../database/commands/migration/migration.command';
import { GetPendingMigrationsCommand } from '../database/commands/migration/get-pending-migrations.command';
import { MigrationsUpCommand } from '../database/commands/migration/migrations-up.command';
import { MigrationsDownCommand } from '../database/commands/migration/migrations-down.command';
import { CheckMigrationNeededCommand } from '../database/commands/migration/check-migration-needed.command';
import { GetExecutedMigrationsCommand } from '../database/commands/migration/get-executed-migrations.command';

@Module({
    imports: [
        MikroOrmModule.forRoot({
            registerRequestContext: false,
            driver: PostgreSqlDriver,
            clientUrl: 'postgres://test:test@localhost:32769/test',
            entities: ['./dist/modules/dogs/entities'],
            entitiesTs: ['./src/modules/dogs/entities'],
            extensions: [Migrator],
        }),
    ],
    providers: [
        MigrationsUpCommand,
        MigrationsDownCommand,
        CheckMigrationNeededCommand,
        GetPendingMigrationsCommand,
        GetExecutedMigrationsCommand,
        MigrationCommand,
    ],
})
export class CLIModule {}
