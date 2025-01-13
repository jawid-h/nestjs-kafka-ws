import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserServiceClientService } from './services/user-service-client.service';
import { UserServiceClientConfig } from './config/user-service-client.config';

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const config = configService.get<UserServiceClientConfig>('clients.userServiceClient');

                return {
                    baseURL: config.baseUrl,
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [UserServiceClientService],
    exports: [UserServiceClientService],
})
export class UserServiceClientModule {}
