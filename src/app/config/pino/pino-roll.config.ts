import { IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, Min, validate, ValidateNested } from 'class-validator';
import { PinoBaseTargetConfig } from './pino-base.config';
import { instanceToPlain, Type } from 'class-transformer';
import pinoRoll from 'pino-roll';

export class PinoRollerTargetLimitOptions {
    @IsInt()
    @IsPositive()
    @Min(1)
    count: number;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoRollerTargetLimitOptions();

        instance.count = parseInt(env.PINO_ROLL_MAX_FILES || '5', 10);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new Error(`Validation failed for PinoRollerTargetLimitOptions: ${validationErrors}`);
        }

        return instance;
    }
}

export class PinoRollerTargetOptions {
    @IsString()
    @IsNotEmpty()
    file: string;

    @IsString()
    @IsNotEmpty()
    size: string;

    @ValidateNested()
    @Type(() => PinoRollerTargetLimitOptions)
    limit: PinoRollerTargetLimitOptions;

    @IsBoolean()
    compress: boolean;

    @IsBoolean()
    mkdir: boolean;

    @IsString()
    @IsNotEmpty()
    frequency: string;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoRollerTargetOptions();

        instance.file = env.PINO_ROLL_FILE;
        instance.size = env.PINO_ROLL_FILE_SIZE || '50m';
        instance.limit = await PinoRollerTargetLimitOptions.fromEnv(env);
        instance.compress = env.PINO_ROLL_COMPRESS === 'true';
        instance.frequency = env.PINO_ROLL_FREQUENCY || 'daily';
        instance.mkdir = env.PINO_ROLL_MKDIR === 'true';

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new Error(`Validation failed for PinoRollerTargetOptions: ${validationErrors}`);
        }

        return instance;
    }
}

export class PinoRollerTargetConfig extends PinoBaseTargetConfig {
    constructor() {
        super('pino-roll');
    }

    async getStream(): Promise<{ level: string; stream: any }> {
        return {
            level: this.level,
            stream: await pinoRoll(this.options),
        };
    }

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoRollerTargetConfig();

        instance.setLevel(env.PINO_ROLL_LEVEL || ('debug' as any));

        const options = PinoRollerTargetOptions.fromEnv(env);

        instance.options = await instanceToPlain(options);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new Error(`Validation failed for PinoRollerTargetConfig: ${validationErrors}`);
        }

        return instance;
    }
}
