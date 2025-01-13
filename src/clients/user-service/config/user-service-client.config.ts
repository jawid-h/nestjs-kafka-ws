import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, validate, ValidateNested } from 'class-validator';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';
import { UserServiceClientAuthConfig } from './user-service-client-auth.config';

export class UserServiceClientConfig {
    @IsString()
    @IsNotEmpty()
    baseUrl: string;

    @ValidateNested()
    @Type(() => UserServiceClientAuthConfig)
    auth: UserServiceClientAuthConfig;

    public static async fromEnv(env: Record<string, string>): Promise<UserServiceClientConfig> {
        const instance = new UserServiceClientConfig();

        instance.baseUrl = env.CLIENT_USER_SERVICE_BASE_URL;
        instance.auth = await UserServiceClientAuthConfig.fromEnv(env);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('User Service client config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}
