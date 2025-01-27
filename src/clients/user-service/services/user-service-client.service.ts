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
    // Since we have a Singleton service, we can store the token in a private variable
    private token: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectPinoLogger(UserServiceClientService.name)
        readonly logger: PinoLogger,
    ) {}

    async onModuleInit() {
        await this.authenticate();

        // Attach the Authorization token to requests
        this.httpService.axiosRef.interceptors.request.use((config) => {
            if (this.token) {
                config.headers['Authorization'] = `Bearer ${this.token}`;
            }

            return config;
        });

        // Attach a response interceptor for handling 401 errors
        this.httpService.axiosRef.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    this.logger.warn('Received 401 Unauthorized. Attempting to re-authenticate...');

                    try {
                        await this.authenticate();

                        error.config.headers['Authorization'] = `Bearer ${this.token}`;

                        this.logger.debug('Retrying the failed request with new token...');

                        return this.httpService.axiosRef.request(error.config);
                    } catch (reAuthError) {
                        this.logger.error('Re-authentication failed', { error: reAuthError });

                        throw reAuthError;
                    }
                }

                return Promise.reject(error);
            },
        );
    }

    private async authenticate() {
        const authConfig = this.configService.get<UserServiceClientAuthConfig>('clients.userServiceClient.auth');
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

            this.token = authData.accessToken;

            this.logger.debug({ token: this.token }, 'Authenticated successfully and obtained new token');
        } catch (error) {
            this.logger.error('Failed to authenticate with user service', { error });

            throw new Error('Failed to authenticate with user service');
        }
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
