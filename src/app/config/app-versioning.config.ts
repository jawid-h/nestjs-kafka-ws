import { IsBoolean, IsNotEmpty, IsString, validate } from 'class-validator';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';

export class AppVersioningConfig {
    @IsBoolean()
    enabled: boolean;

    @IsString()
    @IsNotEmpty()
    prefix: string;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new AppVersioningConfig();

        instance.enabled = env.APP_VERSIONING_ENABLED === 'true';
        instance.prefix = env.APP_VERSIONING_PREFIX || 'v';

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('App versioning config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}
