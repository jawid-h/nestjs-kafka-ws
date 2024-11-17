import { createAppConfig } from '../../../src/config/app.config';
import { ConfigValidationError } from '../../../src/errors/config/config-validation.error';

describe('createAppConfig', () => {
    const validEnv = {
        APP_PORT: '3000',
    };

    it('should return a valid AppConfig when environment variables are valid', () => {
        const config = createAppConfig(validEnv);
        expect(config).toEqual({
            port: 3000,
        });
    });

    it('should throw ConfigValidationError when environment variables are invalid', () => {
        const invalidEnv = { ...validEnv, APP_PORT: '' };
        expect(() => createAppConfig(invalidEnv)).toThrow(
            ConfigValidationError,
        );
    });

    it('should throw ConfigValidationError with detailed validation errors', () => {
        const invalidEnv = { ...validEnv, APP_PORT: '' };
        try {
            createAppConfig(invalidEnv);
        } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);
            expect(error.validationErrors).toBeDefined();
        }
    });
});
