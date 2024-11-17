export interface PinoElasticsearchOptions {
    node: string;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface PinoPrettyOptions {}

export interface PinoTransportTarget {
    target: string;
    options?: PinoElasticsearchOptions | PinoPrettyOptions;
}

export interface PinoHttpOptions {
    level: string;
    transport: {
        targets: PinoTransportTarget[];
    };
}

export interface PinoConfig {
    pinoHttp: PinoHttpOptions;
}
