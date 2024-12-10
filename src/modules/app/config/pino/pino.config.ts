import { registerAs } from '@nestjs/config';
import {
    IsNotEmpty,
    IsString,
    validate,
    ValidateNested,
} from 'class-validator';
import { mapValidationErrors } from 'src/modules/core/utils/map-validation-errors';

import { ConfigValidationError } from 'src/modules/core/errors/config/config-validation.error';
import { Type } from 'class-transformer';

import { PinoBaseTargetConfig } from './pino-base.config';
import { PinoPrettyTargetConfig } from './pino-pretty.config';
import { PinoRollerTargetConfig } from './pino-roll.config';
import { PinoElasticsearchTargetConfig } from './pino-elk.config';

export class PinoConfig {
    @IsString()
    @IsNotEmpty()
    level: string;

    @ValidateNested()
    @Type(() => PinoBaseTargetConfig)
    targets: PinoBaseTargetConfig[];

    public async getTargetStreams(): Promise<{ level: string; stream: any }[]> {
        const streams = [];

        for (const target of this.targets) {
            streams.push(await target.getStream());
        }

        return streams;
    }

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoConfig();

        instance.level = env.PINO_LEVEL || 'debug';

        const targets: PinoBaseTargetConfig[] = [];

        if (env.PINO_TARGETS_PRETTY === 'true') {
            targets.push(await PinoPrettyTargetConfig.fromEnv(env));
        }

        if (env.PINO_TARGETS_ROLL === 'true') {
            targets.push(await PinoRollerTargetConfig.fromEnv(env));
        }

        if (env.PINO_TARGETS_ELK === 'true') {
            targets.push(await PinoElasticsearchTargetConfig.fromEnv(env));
        }

        instance.targets = targets;

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError(
                'Pino config validation error',
                mapValidationErrors(validationErrors),
            );
        }

        return instance;
    }
}

export const pinoConfig = registerAs(
    'pino',
    async (): Promise<PinoConfig> => PinoConfig.fromEnv(process.env),
);
