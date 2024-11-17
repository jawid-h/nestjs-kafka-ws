import * as Joi from 'joi';
import { AppConfig } from 'src/interfaces/app-config.interace';

export const appConfigSchema = Joi.object<AppConfig>({
    port: Joi.number()
        .integer()
        .min(1)
        .max(65535)
        .required()
        .description('Port number for the application'),
});
