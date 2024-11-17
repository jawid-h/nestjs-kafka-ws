import { registerAs } from '@nestjs/config';
import { ConfigValidationError } from 'src/errors/config/config-validation.error';
import { AppConfig } from 'src/interfaces/app-config.interace';
import { mapValidationErrors } from 'src/utils/map-validation-errors';
import { appConfigSchema } from 'src/validation-schemas/config/app-config.schema';

export const createAppConfig = (env: Record<string, string>): AppConfig => {
    const { error, value } = appConfigSchema.validate(
        {
            port: env.APP_PORT,
        },
        { abortEarly: false },
    );

    if (error) {
        const validationErrors = mapValidationErrors(error.details);

        throw new ConfigValidationError(
            'App config validation error',
            validationErrors,
        );
    }

    return value;
};

export const appConfig = registerAs(
    'app',
    (): AppConfig => createAppConfig(process.env),
);
