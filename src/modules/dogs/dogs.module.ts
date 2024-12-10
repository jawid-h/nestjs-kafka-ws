import { DATABASE_SOURCE_SOURCE_B } from '../app/constants/database.constants';
import { DatabaseModule } from '../database/database.module';
import { DogsController } from './controllers/dogs.controller';
import { DogEntity } from './entities/dog.entity';
import { DogsService } from './services/dogs.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        DatabaseModule.forFeature({
            mikroORMOptions: {
                entities: [DogEntity],
                contextName: DATABASE_SOURCE_SOURCE_B,
            },
        }),
    ],
    controllers: [DogsController],
    providers: [DogsService],
})
export class DogsModule {}
