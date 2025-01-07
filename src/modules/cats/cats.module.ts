import { CatsService } from './services/cats.service';
import { DatabaseModule } from '../../database/database.module';
import { CatsController } from './controllers/cats.controller';
import { Module } from '@nestjs/common';
import { CatEntity, CatSchema } from './entities/cat.entity';
import { Model } from 'mongoose';
import { ModelManager } from '../../database/repositories/model-manager';
import { DATABASE_SOURCE_SOURCE_C } from '../../app/constants/database.constants';

@Module({
    imports: [
        DatabaseModule.forFeature({
            mongooseOptions: {
                connectionName: DATABASE_SOURCE_SOURCE_C,
                entities: [
                    {
                        entity: CatEntity,
                        schema: CatSchema,
                    },
                ],
                modelManagerFactory: (catsModel: Model<CatEntity>) =>
                    new ModelManager({
                        CatEntity: catsModel,
                    }),
            },
        }),
    ],
    controllers: [CatsController],
    providers: [CatsService],
})
export class CatsModule {}
