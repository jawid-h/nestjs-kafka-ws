import { QueryFilterInterface } from './query-filter.interface';
import { QuerySortingInterface } from './query-sorting.interface';

/**
 * Interface representing the base structure for a query.
 *
 * @template T - The type of the entity being queried.
 *
 * @property {QueryFilterInterface<T>[]} [filter] - An optional array of filters to apply to the query.
 * @property {QuerySortingInterface<T>[]} [sort] - An optional array of sorting criteria to apply to the query.
 * @property {number} [page] - An optional page number for pagination.
 * @property {number} [size] - An optional page size for pagination.
 *
 * @example
 * // Example usage of BaseQueryInterface
 * const query: BaseQueryInterface<User> = {
 *   filter: [{ field: 'name', operator: 'eq', value: 'John' }],
 *   sort: [{ field: 'createdAt', direction: 'desc' }],
 *   page: 1,
 *   size: 10
 * };
 */
export interface BaseQueryInterface<T> {
    filter?: QueryFilterInterface<T>[];
    sort?: QuerySortingInterface<T>[];
    page?: number;
    size?: number;
}
