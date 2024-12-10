import { Controller, Post } from '@nestjs/common';
import { CatsService } from '../services/cats.service';
import { Payload } from '@nestjs/microservices';
import { QueryDto } from 'src/modules/database/dto/query/query.dto';
import { CatDto } from '../dtos/cat.dto';

@Controller('cats')
export class CatsController {
    constructor(private readonly catsService: CatsService) {}

    @Post('list')
    async findAll(@Payload() query: QueryDto<CatDto>) {
        return this.catsService.findAll(query);
    }

    @Post('create')
    async create(@Payload() data: CatDto) {
        return this.catsService.create(data);
    }
}
