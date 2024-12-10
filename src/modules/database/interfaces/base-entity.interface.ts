export interface BaseEntityInterface<ID = string> {
    id: ID;
    createdAt?: number;
    updatedAt?: number;
}
