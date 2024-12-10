import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsIpPortValidator } from '../validators/ip-port.validator';

export function IsIpPort(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsIpPortValidator,
        });
    };
}
