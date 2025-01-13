import { registerAs } from '@nestjs/config';
import { KeycloackConfig } from './keycloack.config';
import { validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';

export class AuthConfig {
    @ValidateNested()
    @Type(() => KeycloackConfig)
    keycloack: KeycloackConfig;

    public static async fromEnv(env: Record<string, string>): Promise<AuthConfig> {
        const instance = new AuthConfig();

        instance.keycloack = await KeycloackConfig.fromEnv(env);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('Auth config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}

export const authConfig = registerAs('auth', async (): Promise<AuthConfig> => AuthConfig.fromEnv(process.env));
