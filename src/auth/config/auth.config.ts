import { registerAs } from '@nestjs/config';
import { KeycloackConfig } from './keycloack.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthConfig {
    @ValidateNested()
    @Type(() => KeycloackConfig)
    keycloack: KeycloackConfig;

    public static async fromEnv(env: Record<string, string>): Promise<AuthConfig> {
        const instance = new AuthConfig();

        instance.keycloack = await KeycloackConfig.fromEnv(env);

        return instance;
    }
}

export const authConfig = registerAs('auth', async (): Promise<AuthConfig> => AuthConfig.fromEnv(process.env));
