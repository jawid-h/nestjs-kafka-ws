import { Entity, Property } from '@mikro-orm/core';
import { MikroOrmPostgresqlEntity } from 'src/modules/database/entities/base-postgresql-mikroorm.entity';

@Entity({ tableName: 'dogs' })
export class DogEntity extends MikroOrmPostgresqlEntity<number> {
    @Property()
    name: string;

    @Property()
    age: number;
}
