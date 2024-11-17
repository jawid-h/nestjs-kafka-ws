import { ValidationErrorItem } from 'joi';

export function mapValidationErrors(
    validationErrors: ValidationErrorItem[],
): string[] {
    return validationErrors.map((error) => {
        const contextMessage = error.context?.message || error.message;
        const errorPath = error.path.join('.');

        return `${errorPath}: ${contextMessage}`;
    });
}
