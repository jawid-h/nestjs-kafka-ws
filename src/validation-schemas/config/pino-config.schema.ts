import * as Joi from 'joi';
import { PinoConfig } from 'src/interfaces/pino-config.interface';

export const pinoConfigSchema = Joi.object<PinoConfig>({
    pinoHttp: Joi.object({
        level: Joi.string()
            .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
            .required(),
        transport: Joi.object({
            targets: Joi.array()
                .items(
                    Joi.object({
                        target: Joi.string().required(),
                        options: Joi.alternatives()
                            .try(
                                Joi.object({
                                    node: Joi.string().uri().required(),
                                }),
                                Joi.object({}),
                            )
                            .optional(),
                    }),
                )
                .required(),
        }).required(),
    }).required(),
});
