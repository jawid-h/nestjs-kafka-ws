import { EntityManager } from '@mikro-orm/mongodb';

export function isEntityHaveRelations<T>(entityClass: { new (): T }, em: EntityManager) {
    const metadata = em.getMetadata();
    const meta = metadata.get(entityClass.name);

    return meta.relations.length > 0;
}
