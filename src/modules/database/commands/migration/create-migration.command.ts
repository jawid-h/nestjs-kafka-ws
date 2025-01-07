import { MikroORM } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { CommandRunner, Option, SubCommand } from 'nest-commander';

@SubCommand({
    name: 'create-migration',
    description: 'Create migration',
    aliases: ['create'],
})
export class CreateMigrationCommand extends CommandRunner {
    private readonly logger = new Logger(CreateMigrationCommand.name);

    constructor(private readonly orm: MikroORM) {
        super();
    }

    async run(_passedParams: string[], options?: Record<string, any>): Promise<void> {
        this.logger.log('Creating migration');

        const name = options?.name;
        const isBlank = options?.blank;
        const path = options?.path;
        const isInitial = options?.initial;

        const migrator = this.orm.getMigrator();
        const result = await migrator.createMigration(path, isBlank, isInitial, name);

        this.logger.log(`Migration created: ${result.fileName}`);
    }

    @Option({
        flags: '-n, --name <name>',
        description: 'Migration name',
        defaultValue: null,
    })
    parseName(value: string | null): string | null {
        return value;
    }

    @Option({
        flags: '-p, --path <path>',
        description: 'Migration path',
        defaultValue: null,
    })
    parsePath(value: string | null): string | null {
        return value;
    }

    @Option({
        flags: '--blank',
        description: 'Create blank migration',
    })
    parseBlank(): boolean {
        return true;
    }

    @Option({
        flags: '--initial',
        description: 'Is migration initial',
    })
    parseInitial(): boolean {
        return true;
    }
}
