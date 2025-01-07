/**
 * Represents a type that generates a query path string for a given object type `T`.
 *
 * This type recursively traverses the properties of `T` and constructs a string path
 * representation for each property. If a property is an array, it will include the
 * path for the array elements as well.
 *
 * @template T - The object type for which the query path string is generated.
 *
 * @example
 * // Given the following type:
 * type ExampleType = {
 *   user: {
 *     id: number;
 *     name: string;
 *     posts: {
 *       title: string;
 *       content: string;
 *     }[];
 *   };
 * };
 *
 * // The QueryPath type will generate the following string paths:
 * type ExampleQueryPath = QueryPath<ExampleType>;
 * // ExampleQueryPath will be:
 * // "user.id" | "user.name" | "user.posts.title" | "user.posts.content"
 *
 * @example
 * // For a simple object type:
 * type SimpleType = {
 *   id: number;
 *   name: string;
 * };
 *
 * // The QueryPath type will generate the following string paths:
 * type SimpleQueryPath = QueryPath<SimpleType>;
 * // SimpleQueryPath will be:
 * // "id" | "name"
 */
export type QueryPath<T> = T extends object
    ? {
          [K in keyof T]: `${Exclude<K, symbol>}${T[K] extends (infer U)[] ? (QueryPath<U> extends never ? '' : `.${QueryPath<U>}`) : QueryPath<T[K]> extends never ? '' : `.${QueryPath<T[K]>}`}`;
      }[keyof T]
    : never;
