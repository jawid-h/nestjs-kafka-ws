import { MikroORM } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';

@SubCommand({
    name: 'get-executed-migrations',
    description: 'Get a list of executed migrations',
    aliases: ['executed'],
})
export class GetExecutedMigrationsCommand extends CommandRunner {
    private readonly logger = new Logger(GetExecutedMigrationsCommand.name);

    constructor(private readonly orm: MikroORM) {
        super();
    }

    async run(): Promise<void> {
        const migrator = this.orm.getMigrator();

        const result = await migrator.getExecutedMigrations();
        const resultListString = result
            .map((migration) => `${migration.name}\t${migration.executed_at.toISOString()}`)
            .join('\n\t');
        const output = !result.length ? 'none' : `\n\n\t${resultListString}\n\n`;

        this.logger.log(`List of executed migrations: ${output}`);
    }
}
