import { ConfigValidationError } from '../../../../src/errors/config/config-validation.error';

describe('ConfigValidationError', () => {
    it('should create an instance of ConfigValidationError', () => {
        const validationErrors = ['error1', 'error2'];
        const error = new ConfigValidationError(
            'Invalid configuration',
            validationErrors,
        );

        expect(error).toBeInstanceOf(ConfigValidationError);
        expect(error.message).toBe(
            'Invalid configuration due to [error1,error2]',
        );
        expect(error.validationErrors).toEqual(validationErrors);
        expect(error.name).toBe('ConfigValidationError');
    });

    it('should have the correct message format', () => {
        const validationErrors = ['missing field', 'invalid type'];
        const error = new ConfigValidationError(
            'Configuration error',
            validationErrors,
        );

        expect(error.message).toBe(
            'Configuration error due to [missing field,invalid type]',
        );
    });

    it('should store validation errors correctly', () => {
        const validationErrors = ['error1'];
        const error = new ConfigValidationError(
            'Error occurred',
            validationErrors,
        );

        expect(error.validationErrors).toContain('error1');
    });

    it('should set the name property to ConfigValidationError', () => {
        const validationErrors = [];
        const error = new ConfigValidationError('No errors', validationErrors);

        expect(error.name).toBe('ConfigValidationError');
    });
});
