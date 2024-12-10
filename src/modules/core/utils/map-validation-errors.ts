import { ValidationError } from 'class-validator';

export function mapValidationErrors(
    validationErrors: ValidationError[],
): string[] {
    return validationErrors.map((error) => {
        return error.toString();
    });
}
