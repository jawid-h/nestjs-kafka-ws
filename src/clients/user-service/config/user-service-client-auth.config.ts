import { IsNotEmpty, IsString, validate } from 'class-validator';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';

export class UserServiceClientAuthConfig {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    clientId: string;

    @IsString()
    @IsNotEmpty()
    realm: string;

    public static async fromEnv(env: Record<string, string>): Promise<UserServiceClientAuthConfig> {
        const instance = new UserServiceClientAuthConfig();

        instance.username = env.CLIENT_USER_SERVICE_AUTH_USERNAME;
        instance.password = env.CLIENT_USER_SERVICE_AUTH_PASSWORD;
        instance.clientId = env.CLIENT_USER_SERVICE_AUTH_CLIENT_ID;
        instance.realm = env.CLIENT_USER_SERVICE_AUTH_REALM;

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError(
                'User Service client auth config validation error',
                mapValidationErrors(validationErrors),
            );
        }

        return instance;
    }
}
