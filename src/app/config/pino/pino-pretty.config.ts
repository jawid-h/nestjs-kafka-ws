import { instanceToPlain } from 'class-transformer';
import { PinoBaseTargetConfig } from './pino-base.config';
import { IsBoolean, validate } from 'class-validator';
import pinoPretty from 'pino-pretty';

export class PinoPrettyTargetOptions {
    @IsBoolean()
    colorize?: boolean;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoPrettyTargetOptions();

        instance.colorize = env.PINO_PRETTY_COLORIZE === 'true';

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new Error(`Validation failed for PinoPrettyTargetOptions: ${validationErrors}`);
        }

        return instance;
    }
}

export class PinoPrettyTargetConfig extends PinoBaseTargetConfig {
    constructor() {
        super('pino-pretty');
    }

    async getStream(): Promise<{ level: string; stream: any }> {
        return {
            level: this.level,
            stream: pinoPretty(this.options),
        };
    }

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoPrettyTargetConfig();

        instance.setLevel(env.PINO_PRETTY_LEVEL || ('debug' as any));

        const options = PinoPrettyTargetOptions.fromEnv(env);

        instance.options = await instanceToPlain(options);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new Error(`Validation failed for PinoPrettyTargetConfig: ${validationErrors}`);
        }

        return instance;
    }
}
