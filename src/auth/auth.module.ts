import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloackConfig } from './config/keycloack.config';

@Module({
    imports: [
        KeycloakConnectModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const keyCloackConfig = configService.get<KeycloackConfig>('auth.keycloack');

                return {
                    authServerUrl: keyCloackConfig.authServerURL,
                    realm: keyCloackConfig.realm,
                    clientId: keyCloackConfig.clientID,
                    secret: keyCloackConfig.clientSecret,
                    multiTenant: {
                        realmResolver: () => {
                            return keyCloackConfig.realm;
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [],
    controllers: [],
    exports: [KeycloakConnectModule],
})
export class AuthModule {}
