import { EntityManager } from '@mikro-orm/core';
import { ReferenceKind } from '@mikro-orm/core';

export class RelationalSearchAggregationPipeline<T> {
    private pipeline: any[] = [];

    constructor(
        entityClass: { new (): T },
        private em: EntityManager,
    ) {
        this.buildLookupStages(entityClass.name);
    }

    private buildLookupStages(entityName: string) {
        const metadata = this.em.getMetadata();
        const meta = metadata.get(entityName);

        for (const relation of meta.relations) {
            const foreignCollection = relation.targetMeta?.collection;

            const lookupProperties: any = {
                from: foreignCollection,
                localField: '_id',
                as: relation.name,
            };

            if (relation.kind !== ReferenceKind.ONE_TO_ONE) {
                lookupProperties['foreignField'] = relation.mappedBy || relation.inversedBy;
            }

            this.pipeline.push({
                $lookup: lookupProperties,
            });
        }
    }

    addFilter(filter: Record<string, any> | null): this {
        if (filter !== null) {
            this.pipeline.push({ $match: filter });
        }

        return this;
    }

    addOrderBy(orderBy: Record<string, 1 | -1> | null): this {
        if (orderBy !== null) {
            this.pipeline.push({ $sort: orderBy });
        }

        return this;
    }

    addPagination(pageSize: number | null, pageNumber: number | null): this {
        const limit = pageSize || 0;
        const offset = pageNumber === null ? 0 : (pageNumber - 1) * pageSize;

        if (limit > 0) {
            this.pipeline.push({ $limit: limit });
        }

        if (offset > 0) {
            this.pipeline.push({ $skip: offset });
        }

        return this;
    }

    getPipeline(): any[] {
        return this.pipeline;
    }

    getPipelineWithCount(): any[] {
        return [
            {
                $facet: {
                    results: this.pipeline,
                    totalCount: [{ $count: 'count' }],
                },
            },
        ];
    }
}
