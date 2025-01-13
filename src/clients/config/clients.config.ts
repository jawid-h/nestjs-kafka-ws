import { registerAs } from '@nestjs/config';
import { validate, ValidateNested } from 'class-validator';
import { ConfigValidationError } from 'src/core/errors/config/config-validation.error';
import { mapValidationErrors } from 'src/core/utils/map-validation-errors';
import { UserServiceClientConfig } from '../user-service/config/user-service-client.config';
import { Type } from 'class-transformer';

export class ClientsConfig {
    @ValidateNested()
    @Type(() => UserServiceClientConfig)
    userServiceClient: UserServiceClientConfig;

    public static async fromEnv(env: Record<string, string>): Promise<ClientsConfig> {
        const instance = new ClientsConfig();

        instance.userServiceClient = await UserServiceClientConfig.fromEnv(env);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new ConfigValidationError('User Service client config validation error', mapValidationErrors(validationErrors));
        }

        return instance;
    }
}

export const clientsConfig = registerAs('clients', async (): Promise<ClientsConfig> => ClientsConfig.fromEnv(process.env));
