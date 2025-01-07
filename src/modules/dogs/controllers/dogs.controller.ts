import { Controller, Post } from '@nestjs/common';
import { DogsService } from '../services/dogs.service';
import { Payload } from '@nestjs/microservices';
import { QueryDto } from 'src/database/dto/query/query.dto';
import { DogDto } from '../dtos/dog.dto';

@Controller('dogs')
export class DogsController {
    constructor(private readonly dogsService: DogsService) {}

    @Post('list')
    async findAll(@Payload() query: QueryDto<DogDto>) {
        return this.dogsService.findAll(query);
    }

    @Post('create')
    async create(@Payload() data: DogDto) {
        return this.dogsService.create(data);
    }
}
