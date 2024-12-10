import {
    PipeTransform,
    Injectable,
    BadRequestException,
    ArgumentMetadata,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, ObjectId> {
    transform(value: string, meta: ArgumentMetadata): ObjectId {
        if (!ObjectId.isValid(value)) {
            const { data } = meta;

            throw new BadRequestException(
                `'${data}' parameter should be a hex representation of an ObjectId`,
            );
        }

        return new ObjectId(value);
    }
}
