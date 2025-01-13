import { IsNotEmpty, IsString, IsUrl, validate } from 'class-validator';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';

export class KeycloackConfig {
    @IsString()
    @IsNotEmpty()
    clientID: string;

    @IsString()
    @IsNotEmpty()
    clientSecret: string;

    @IsString()
    @IsNotEmpty()
    realm: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    authServerURL: string;

    public static async fromEnv(env: Record<string, string>): Promise<KeycloackConfig> {
        const instance = new KeycloackConfig();

        instance.clientID = env.AUTH_KEYCLOACK_CLIENT_ID;
        instance.clientSecret = env.AUTH_KEYCLOACK_CLIENT_SECRET;
        instance.realm = env.AUTH_KEYCLOACK_REALM;
        instance.authServerURL = env.AUTH_KEYCLOACK_SERVER_URL;

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('KeyCloack config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}
