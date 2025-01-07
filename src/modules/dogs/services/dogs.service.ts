import { Injectable } from '@nestjs/common';
import { BaseCRUDService } from 'src/database/services/base-crud.service';
import { DogEntity } from '../entities/dog.entity';
import { RepositoryManager } from 'src/database/repositories/repository-manager';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class DogsService extends BaseCRUDService<DogEntity, number> {
    constructor(
        private readonly repositoryManager: RepositoryManager,
        @InjectPinoLogger(DogEntity.name)
        readonly logger: PinoLogger,
    ) {
        super(repositoryManager.getRepository(DogEntity), logger);
    }
}
