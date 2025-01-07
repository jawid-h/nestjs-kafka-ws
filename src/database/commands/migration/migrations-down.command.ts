import { MikroORM } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { CommandRunner, Option, SubCommand } from 'nest-commander';

@SubCommand({
    name: 'migrations-down',
    description: 'Revert migrations',
    aliases: ['down'],
})
export class MigrationsDownCommand extends CommandRunner {
    private readonly logger = new Logger(MigrationsDownCommand.name);

    constructor(private readonly orm: MikroORM) {
        super();
    }

    async run(_passedParams: string[], options?: Record<string, any>): Promise<void> {
        this.logger.log('Reverting migrations');

        const from = options?.from;
        const to = options?.to;
        const migrations = options?.migrations;

        const migrator = this.orm.getMigrator();
        const result = await migrator.down({
            from,
            to,
            migrations,
        });

        const resultListString = result.map((migration) => migration.name).join('\n\t');
        const output = !result.length ? 'none' : `\n\n\t${resultListString}\n\n`;

        this.logger.log(`List of executed migrations: ${output}`);
    }

    @Option({
        flags: '-f, --from <from>',
        description: 'From migration',
    })
    parseFrom(value: string | number | null): string | number | null {
        return value;
    }

    @Option({
        flags: '-t, --to <to>',
        description: 'To migration',
    })
    parseTo(value: string | number | null): string | number | null {
        return value;
    }

    @Option({
        flags: '-m, --migrations <migrations>',
        description: 'List of migrations to revert',
    })
    parseBlank(value: string | null): string[] | null {
        return value?.split(',');
    }
}
