import { IsNotEmpty, validate, IsPort, ValidateNested, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';
import { Type } from 'class-transformer';
import { AppVersioningConfig } from './app-versioning.config';

export class AppConfig {
    @IsString()
    @IsNotEmpty()
    host: string;

    @IsPort()
    @IsNotEmpty()
    port: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    globalPrefix: string;

    @ValidateNested()
    @Type(() => AppVersioningConfig)
    versioning: AppVersioningConfig;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new AppConfig();

        instance.port = env.APP_PORT || '3000';
        instance.host = env.APP_HOST || 'localhost';
        instance.name = env.APP_NAME;
        instance.description = env.APP_DESCRIPTION;
        instance.globalPrefix = env.APP_GLOBAL_PREFIX || 'api';
        instance.versioning = await AppVersioningConfig.fromEnv(env);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('App config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}

export const appConfig = registerAs('app', async (): Promise<AppConfig> => AppConfig.fromEnv(process.env));
