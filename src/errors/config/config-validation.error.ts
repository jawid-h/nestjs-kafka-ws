export class ConfigValidationError extends Error {
    public readonly validationErrors: string[];

    constructor(message: string, validationErrors: string[]) {
        super(`${message} due to [${validationErrors.join(',')}]`);

        this.validationErrors = validationErrors;
        this.name = 'ConfigValidationError';
    }
}
