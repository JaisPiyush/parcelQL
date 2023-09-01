import { Knex } from 'knex';
import { ParcelQLExpression } from '../../schema/column-expression/base-column-expression';
import { BaseQueryBuilder, IBaseQueryBuilder } from '../base-query-builder';

export type Class<T, Q = any> = Function & { prototype: T } & {
    new (
        query: Q,
        parent?: Class<IBaseQueryBuilder<any, any>>,
        restrictedBuilders?: string[]
    ): T;
};

export class BaseColumnBuilder<
    T extends ParcelQLExpression = ParcelQLExpression,
    R = Knex.Raw
> extends BaseQueryBuilder<T, R> {
    protected parent?: Class<IBaseQueryBuilder<T, R>>;
    protected restrictedBuilders: string[] = [];

    constructor(
        query: T,
        parent?: Class<IBaseQueryBuilder<T, R>>,
        restrictedBuilders?: string[]
    ) {
        super(query);
        this.parent = parent;
        this.restrictedBuilders = restrictedBuilders || [];
    }

    setParent(parent: Class<IBaseQueryBuilder<T, R>>) {
        this.parent = parent;
    }

    setRestrictedBuilders(restrictedBuilders: string[]) {
        this.restrictedBuilders = restrictedBuilders;
    }
}
