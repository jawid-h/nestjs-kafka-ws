import { pinoConfigSchema } from '../../../src/validation-schemas/config/pino-config.schema';

describe('Pino Config Schema Validator', () => {
    let validConfig;

    beforeEach(() => {
        validConfig = {
            pinoHttp: {
                level: 'info',
                transport: {
                    targets: [
                        {
                            target: 'pino-elasticsearch',
                            options: {
                                node: 'http://localhost:3000',
                            },
                        },
                    ],
                },
            },
        };
    });

    it('should validate a correct config', () => {
        const { error } = pinoConfigSchema.validate(validConfig);
        expect(error).toBeUndefined();
    });

    it('should invalidate a config with invalid level', () => {
        validConfig.pinoHttp.level = 'invalidLevel';

        const { error } = pinoConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with missing transport', () => {
        delete validConfig.pinoHttp.transport;

        const { error } = pinoConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with invalid transport target', () => {
        validConfig.pinoHttp.transport.targets[0].target = 1234;

        const { error } = pinoConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with invalid transport options node', () => {
        validConfig.pinoHttp.transport.targets[0].options.node = 'invalidUrl';

        const { error } = pinoConfigSchema.validate(validConfig);
        expect(error).toBeDefined();
    });
});
