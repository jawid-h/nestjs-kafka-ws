import { Injectable } from '@nestjs/common';
import { CatEntity } from '../entities/cat.entity';
import { ObjectId } from 'mongoose';
import { RepositoryManager } from 'src/modules/database/repositories/repository-manager';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { BaseCRUDService } from 'src/modules/database/services/base-crud.service';

@Injectable()
export class CatsService extends BaseCRUDService<CatEntity, ObjectId> {
    constructor(
        private readonly repositoryManager: RepositoryManager,
        @InjectPinoLogger(CatsService.name)
        readonly logger: PinoLogger,
    ) {
        super(repositoryManager.getRepository(CatEntity), logger);
    }
}
