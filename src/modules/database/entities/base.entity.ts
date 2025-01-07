import { BaseEntityInterface } from '../interfaces/base-entity.interface';

export abstract class BaseEntity<ID = string> implements BaseEntityInterface<ID> {
    abstract id: ID;

    createdAt?: number;
    updatedAt?: number;
}
