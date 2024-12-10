import { QueryPath } from '../../types/query/query-path.type';

export enum SortingDirection {
    ASC = 'asc',
    DESC = 'desc',
}

/**
 * Interface representing the sorting criteria for a query.
 *
 * @template T - The type of the entity being queried.
 *
 * @property {QueryPath<T>} path - The path to the field by which to sort.
 * @property {SortingDirection} direction - The direction of the sort (e.g., ascending or descending).
 *
 * @example
 * // Example usage:
 * const sortingCriteria: QuerySortingInterface<User> = {
 *     path: 'name',
 *     direction: 'asc'
 * };
 */
export interface QuerySortingInterface<T> {
    path: QueryPath<T>;
    direction: SortingDirection;
}
