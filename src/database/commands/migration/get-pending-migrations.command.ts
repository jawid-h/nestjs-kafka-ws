import { MikroORM } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';

@SubCommand({
    name: 'get-pening-migrations',
    description: 'Check if there any pening migrations',
    aliases: ['pending'],
})
export class GetPendingMigrationsCommand extends CommandRunner {
    private readonly logger = new Logger(GetPendingMigrationsCommand.name);

    constructor(private readonly orm: MikroORM) {
        super();
    }

    async run(): Promise<void> {
        const migrator = this.orm.getMigrator();

        const result = await migrator.getPendingMigrations();
        const resultListString = result.map((migration) => migration.name).join('\n\t');
        const output = !result.length ? 'none' : `\n\n\t${resultListString}\n\n`;

        this.logger.log(`List of pening migrations: ${output}`);
    }
}
