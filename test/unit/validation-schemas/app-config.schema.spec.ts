import { appConfigSchema } from '../../../src/validation-schemas/config/app-config.schema';

describe('appConfigSchema', () => {
    it('should validate a valid config', () => {
        const validConfig = { port: 3000 };
        const { error } = appConfigSchema.validate(validConfig);
        expect(error).toBeUndefined();
    });

    it('should invalidate a config with a port number less than 1', () => {
        const invalidConfig = { port: 0 };
        const { error } = appConfigSchema.validate(invalidConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with a port number greater than 65535', () => {
        const invalidConfig = { port: 70000 };
        const { error } = appConfigSchema.validate(invalidConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with a non-integer port number', () => {
        const invalidConfig = { port: 3000.5 };
        const { error } = appConfigSchema.validate(invalidConfig);
        expect(error).toBeDefined();
    });

    it('should invalidate a config with a missing port number', () => {
        const invalidConfig = {};
        const { error } = appConfigSchema.validate(invalidConfig);
        expect(error).toBeDefined();
    });
});
