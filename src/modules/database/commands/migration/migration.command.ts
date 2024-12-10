import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { MigrationsUpCommand } from './migrations-up.command';
import { MigrationsDownCommand } from './migrations-down.command';
import { CheckMigrationNeededCommand } from './check-migration-needed.command';
import { GetPendingMigrationsCommand } from './get-pending-migrations.command';
import { GetExecutedMigrationsCommand } from './get-executed-migrations.command';

@Command({
    name: 'migration',
    description: 'Set of migration commands',
    arguments: '<command>',
    subCommands: [
        MigrationsUpCommand,
        MigrationsDownCommand,
        CheckMigrationNeededCommand,
        GetPendingMigrationsCommand,
        GetExecutedMigrationsCommand,
    ],
})
export class MigrationCommand extends CommandRunner {
    private readonly logger: Logger = new Logger(MigrationCommand.name);

    async run(): Promise<void> {
        this.logger.log(
            'Available commands: up, down, needed, pending, executed',
        );
    }
}
