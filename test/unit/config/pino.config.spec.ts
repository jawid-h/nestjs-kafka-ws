import { createPinoConfig } from '../../../src/config/pino.config';
import { ConfigValidationError } from '../../../src/errors/config/config-validation.error';

describe('createPinoConfig', () => {
    const validEnv = {
        PINO_HTTP_LEVEL: 'info',
        PINO_PRETTY: 'true',
        PINO_ELK_URL: 'http://localhost:9200',
    };

    it('should return a valid PinoConfig when environment variables are valid', () => {
        const config = createPinoConfig(validEnv);
        expect(config).toEqual({
            pinoHttp: {
                level: 'info',
                transport: {
                    targets: [
                        { target: 'pino-pretty' },
                        {
                            target: 'pino-elasticsearch',
                            options: { node: 'http://localhost:9200' },
                        },
                    ],
                },
            },
        });
    });

    it('should return a valid PinoConfig without pretty and elasticsearch targets when environment variables are not set', () => {
        const config = createPinoConfig({ PINO_HTTP_LEVEL: 'info' });
        expect(config).toEqual({
            pinoHttp: {
                level: 'info',
                transport: {
                    targets: [],
                },
            },
        });
    });

    it('should throw ConfigValidationError when environment variables are invalid', () => {
        const invalidEnv = { ...validEnv, PINO_HTTP_LEVEL: '' };
        expect(() => createPinoConfig(invalidEnv)).toThrow(
            ConfigValidationError,
        );
    });

    it('should throw ConfigValidationError with detailed validation errors', () => {
        const invalidEnv = { ...validEnv, PINO_HTTP_LEVEL: '' };
        try {
            createPinoConfig(invalidEnv);
        } catch (error) {
            expect(error).toBeInstanceOf(ConfigValidationError);
            expect(error.validationErrors).toBeDefined();
        }
    });

    it('should handle missing optional environment variables gracefully', () => {
        const config = createPinoConfig({ PINO_HTTP_LEVEL: 'debug' });
        expect(config).toEqual({
            pinoHttp: {
                level: 'debug',
                transport: {
                    targets: [],
                },
            },
        });
    });
});
