import { QueryPath } from '../../types/query/query-path.type';
import { QueryValue } from '../../types/query/query-value.type';

export enum FilterOperator {
    EQUAL = '==',
    NOT_EQUAL = '!=',
    LESS_THAN = '<',
    LESS_THAN_OR_EQUAL = '<=',
    GREATER_THAN = '>',
    GREATER_THAN_OR_EQUAL = '>=',
    IN = 'in',
    NOT_IN = 'nin',
    EXISTS = 'exists',
    LIKE = 'like',
    ILIKE = 'ilike',
}

/**
 * Interface representing a query filter.
 *
 * @template T - The type of the entity being queried.
 *
 * @property {QueryPath<T>} path - The path of the property to filter on.
 * @property {FilterOperator} operator - The operator to use for filtering.
 * @property {QueryValue<T, QueryPath<T>>} value - The value to filter by.
 *
 * @example
 * // Example usage:
 * const filter: QueryFilterInterface<User> = {
 *     path: 'name',
 *     operator: 'equals',
 *     value: 'John Doe'
 * };
 */
export interface QueryFilterInterface<T> {
    path: QueryPath<T>;
    operator: FilterOperator;
    value: QueryValue<T, QueryPath<T>>;
}
