import { IsInt, IsNotEmpty, IsString, IsUrl, Min, validate, ValidateNested } from 'class-validator';
import { PinoBaseTargetConfig } from './pino-base.config';
import pinoElasticsearch from 'pino-elasticsearch';
import { instanceToPlain, Type } from 'class-transformer';

export class PinoElasticsearchTargetAuthOptions {
    @IsString()
    @IsNotEmpty()
    public username: string;

    @IsString()
    @IsNotEmpty()
    public password: string;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoElasticsearchTargetAuthOptions();

        instance.username = env.PINO_ELK_AUTH_USERNAME;
        instance.password = env.PINO_ELK_AUTH_PASSWORD;

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new Error(`Validation failed for PinoElasticsearchTargetAuthOptions: ${validationErrors}`);
        }

        return instance;
    }
}

export class PinoElasticsearchTargetOptions {
    @IsUrl()
    @IsNotEmpty()
    public node: string;

    @IsString()
    @IsNotEmpty()
    public index: string;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    public flushBytes: number;

    @IsString()
    @IsNotEmpty()
    public esVersion: string;

    @ValidateNested()
    @Type(() => PinoElasticsearchTargetAuthOptions)
    public auth: PinoElasticsearchTargetAuthOptions;

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoElasticsearchTargetOptions();

        instance.node = env.PINO_ELK_NODE;
        instance.index = env.PINO_ELK_INDEX;
        instance.flushBytes = parseInt(env.PINO_ELK_FLUSH_BYTES || '1024', 10);
        instance.esVersion = env.PINO_ELK_VERSION || '8';
        instance.auth = await PinoElasticsearchTargetAuthOptions.fromEnv(env);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new Error(`Validation failed for PinoElasticsearchTargetOptions: ${validationErrors}`);
        }

        return instance;
    }
}

export class PinoElasticsearchTargetConfig extends PinoBaseTargetConfig {
    constructor() {
        super('pino-elasticsearch');
    }

    async getStream(): Promise<{ level: string; stream: any }> {
        return {
            level: this.level,
            stream: pinoElasticsearch(this.options),
        };
    }

    public static async fromEnv(env: Record<string, string>) {
        const instance = new PinoElasticsearchTargetConfig();

        instance.setLevel(env.PINO_ELK_LEVEL || ('debug' as any));

        const options = PinoElasticsearchTargetOptions.fromEnv(env);

        instance.options = await instanceToPlain(options);

        const validationErrors = await validate(instance);

        if (validationErrors.length > 0) {
            throw new Error(`Validation failed for PinoElasticsearchTargetConfig: ${validationErrors}`);
        }

        return instance;
    }
}
