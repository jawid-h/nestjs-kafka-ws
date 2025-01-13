import { Module } from '@nestjs/common';
import { UserServiceClientModule } from './user-service/user-service-client.module';

@Module({
    imports: [UserServiceClientModule],
    providers: [],
    controllers: [],
    exports: [UserServiceClientModule],
})
export class ClientsModule {}
