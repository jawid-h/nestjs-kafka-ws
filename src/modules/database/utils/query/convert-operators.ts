import { FilterOperator } from '../../interfaces/query/query-filter.interface';

type DBType = 'mongo' | 'postgres';

export function convertOperators(operator: FilterOperator, value: any, dbType: DBType): Record<string, any> {
    switch (operator) {
        case FilterOperator.EQUAL:
            return { $eq: value };
        case FilterOperator.NOT_EQUAL:
            return { $ne: value };
        case FilterOperator.LESS_THAN:
            return { $lt: value };
        case FilterOperator.LESS_THAN_OR_EQUAL:
            return { $lte: value };
        case FilterOperator.GREATER_THAN:
            return { $gt: value };
        case FilterOperator.GREATER_THAN_OR_EQUAL:
            return { $gte: value };
        case FilterOperator.IN:
            return { $in: value };
        case FilterOperator.NOT_IN:
            return { $nin: value };
        case FilterOperator.EXISTS:
            return { $exists: value };
        case FilterOperator.LIKE:
            return dbType === 'mongo' ? { $regex: new RegExp(value) } : { $like: `%${value}%` };
        case FilterOperator.ILIKE:
            return dbType === 'mongo' ? { $regex: new RegExp(value, 'i') } : { $ilike: `%${value}%` };
    }
}
