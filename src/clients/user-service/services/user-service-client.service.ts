import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AUTH_HANDLER, USER_LIST_HANDLER } from '../constants/handlers.constantants';
import { UserServiceClientAuthConfig } from '../config/user-service-client-auth.config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthResponseDto } from '../dtos/auth/response.dto';
import { AUTH_REALM_HEADER } from '../constants/headers.constants';
import { UserDto } from '../dtos/user.dto';
import { UserListResponseDto } from '../dtos/user-list-response.dto';

@Injectable({ scope: Scope.DEFAULT })
export class UserServiceClientService implements OnModuleInit {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectPinoLogger(UserServiceClientService.name)
        readonly logger: PinoLogger,
    ) {}

    async onModuleInit() {
        const authConfig = this.configService.get<UserServiceClientAuthConfig>('clients.userServiceClient.auth');

        let token: string;
        try {
            const {
                data: { object: authData },
            } = await this.httpService.axiosRef.post<AuthResponseDto>(
                AUTH_HANDLER,
                {
                    username: authConfig.username,
                    password: authConfig.password,
                    clientId: authConfig.clientId,
                    realm: authConfig.realm,
                },
                {
                    headers: {
                        [AUTH_REALM_HEADER]: authConfig.realm,
                    },
                },
            );

            token = authData.accessToken;

            this.logger.debug({ token }, 'got auth token for user service');
        } catch (error) {
            // TODO: handle someway and re-throw
            throw error;
        }

        if (!token) {
            throw new Error('Failed to authenticate with user service');
        }

        this.httpService.axiosRef.interceptors.request.use((config) => {
            config.headers['Authorization'] = `Bearer ${token}`;

            return config;
        });
    }

    public async getUsersByRoles(roles: string[]): Promise<UserDto[]> {
        this.logger.debug({ roles }, 'getting users by roles');

        const filterQuery = {
            filters: [
                {
                    field: 'roles',
                    operator: 'in',
                    value: roles,
                },
            ],
            page: 1,
            size: 100,
        };

        const {
            data: {
                object: { items: userList },
            },
        } = await this.httpService.axiosRef.post<UserListResponseDto>(USER_LIST_HANDLER, filterQuery);

        return userList;
    }
}
