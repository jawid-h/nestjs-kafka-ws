import { QueryPath } from './query-path.type';

/**
 * Type to extract the value type at a given query path within a nested object type.
 *
 * @template T - The base object type.
 * @template PathSegment - The query path as a string literal type.
 *
 * @example
 * type ExampleType = {
 *   user: {
 *     id: number;
 *     profile: {
 *       name: string;
 *       age: number;
 *     };
 *   };
 * };
 *
 * // Extracts the type of `name` in the nested `profile` object.
 * type NameType = QueryValue<ExampleType, 'user.profile.name'>; // string
 *
 * // Extracts the type of `id` in the nested `user` object.
 * type IdType = QueryValue<ExampleType, 'user.id'>; // number
 *
 * // Extracts the type of `profile` in the nested `user` object.
 * type ProfileType = QueryValue<ExampleType, 'user.profile'>; // { name: string; age: number; }
 */
export type QueryValue<T, PathSegment extends QueryPath<T>> = PathSegment extends `${infer Key}.${string}`
    ? Key extends keyof T
        ? QueryValue<T[Key], QueryPath<T[Key]>>
        : never
    : PathSegment extends keyof T
      ? T[PathSegment]
      : never;
