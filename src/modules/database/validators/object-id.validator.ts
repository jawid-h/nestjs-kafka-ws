import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { ObjectId } from 'mongodb';

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return ObjectId.isValid(value);
    }

    defaultMessage(): string {
        return 'Should be a hex representation of an ObjectId';
    }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsObjectIdConstraint,
        });
    };
}
