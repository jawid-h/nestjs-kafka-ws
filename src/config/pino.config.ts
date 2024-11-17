import { registerAs } from '@nestjs/config';
import { ConfigValidationError } from 'src/errors/config/config-validation.error';
import { PinoConfig } from 'src/interfaces/pino-config.interface';
import { mapValidationErrors } from 'src/utils/map-validation-errors';
import { pinoConfigSchema } from 'src/validation-schemas/config/pino-config.schema';

export const createPinoConfig = (env: Record<string, string>): PinoConfig => {
    const targets = [];

    if (env.PINO_PRETTY === 'true') {
        targets.push({
            target: 'pino-pretty',
        });
    }

    if (env.PINO_ELK_URL !== undefined && env.PINO_ELK_URL !== '') {
        targets.push({
            target: 'pino-elasticsearch',
            options: {
                node: env.PINO_ELK_URL,
            },
        });
    }

    const { error, value } = pinoConfigSchema.validate(
        {
            pinoHttp: {
                level: env.PINO_HTTP_LEVEL,
                transport: {
                    targets,
                },
            },
        },
        { abortEarly: false },
    );

    if (error) {
        const validationErrors = mapValidationErrors(error.details);

        throw new ConfigValidationError(
            'Pino config validation error',
            validationErrors,
        );
    }

    return value;
};

export const pinoConfig = registerAs(
    'pino',
    (): PinoConfig => createPinoConfig(process.env),
);
