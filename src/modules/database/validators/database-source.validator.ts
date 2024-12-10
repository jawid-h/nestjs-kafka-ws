import {
    registerDecorator,
    validateSync,
    ValidationArguments,
    ValidationError,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDatabaseSourceConstraint
    implements ValidatorConstraintInterface
{
    private errors: Record<string, ValidationError[]> = {};

    validate(value: any): boolean {
        if (typeof value !== 'object' || value === null) {
            return false;
        }

        for (const key in value) {
            const errors = validateSync(value[key], {
                whitelist: true,
                forbidNonWhitelisted: true,
            });

            if (errors.length > 0) {
                this.errors[key] = [...errors];
            }
        }

        return Object.keys(this.errors).length === 0;
    }

    defaultMessage(args: ValidationArguments): string {
        const errorDetails = Object.entries(this.errors)
            .map(([key, errors]) => `${key}: ${JSON.stringify(errors)}`)
            .join(', ');

        return `${args.property} contains invalid entries. Errors: ${errorDetails}`;
    }
}

export function IsValidDatabaseSource(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidDatabaseSourceConstraint,
        });
    };
}
