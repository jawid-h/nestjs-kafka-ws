import {
    CanActivate,
    ExecutionContext,
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RequestValidationGuard implements CanActivate {
    constructor(private readonly dto: any) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let body;
        if (request.method === 'GET') {
            body = request.query;
        } else {
            body = request.body;
        }

        const dtoInstance = plainToInstance(this.dto, body);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            throw new BadRequestException(
                errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            );
        }

        return true;
    }
}
