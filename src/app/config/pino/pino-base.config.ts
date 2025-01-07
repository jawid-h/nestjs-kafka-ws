import { IsNotEmpty, IsString } from 'class-validator';

import pino from 'pino';

export abstract class PinoBaseTargetConfig {
    @IsString()
    @IsNotEmpty()
    target: string;

    @IsString()
    @IsNotEmpty()
    level: string;

    options: Record<string, any>;

    constructor(target: string) {
        this.target = target;
    }

    setLevel(level: pino.Level = 'debug') {
        this.level = level;
    }

    abstract getStream(): Promise<{ level: string; stream: any }>;
}
