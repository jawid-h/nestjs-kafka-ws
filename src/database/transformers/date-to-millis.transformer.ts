import { EntityProperty, Platform, Type } from '@mikro-orm/core';

export class DateToMillisTransformer extends Type<number, Date> {
    convertToDatabaseValue(
        value: number | null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        platform: Platform,
    ): Date | null {
        if (!value) return null;

        return new Date(value);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    convertToJSValue(value: Date | null, platform: Platform): number | null {
        if (!value) return null;

        return new Date(value).getTime();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getColumnType(prop: EntityProperty, platform: Platform): string {
        return 'timestamp';
    }
}
