import { MikroORM } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';

@SubCommand({
    name: 'check-migration-needed',
    description: 'Check migration needed',
    aliases: ['needed'],
})
export class CheckMigrationNeededCommand extends CommandRunner {
    private readonly logger = new Logger(CheckMigrationNeededCommand.name);

    constructor(private readonly orm: MikroORM) {
        super();
    }

    async run(): Promise<void> {
        const migrator = this.orm.getMigrator();

        const result = await migrator.checkMigrationNeeded();

        this.logger.log(`Is migration needed: ${result ? 'Yes' : 'No'}`);
    }
}
