import { CommandFactory } from 'nest-commander';
import { CLIModule } from './modules/cli/cli.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    await CommandFactory.run(CLIModule, new Logger());
}

bootstrap();
