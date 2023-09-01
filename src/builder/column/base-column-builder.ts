import { Knex } from "knex";
import { ParcelQLExpression } from "../../schema/column-expression/base-column-expression";
import { BaseQueryBuilder, IBaseQueryBuilder } from "../base-query-builder";

export type Class<T> = Function & { prototype: T } & { new (...args: any[]): T };

export class BaseColumnBuilder<T extends ParcelQLExpression = ParcelQLExpression,R = Knex.Raw> extends
    BaseQueryBuilder<T,R> {

        protected parent?: Class<IBaseQueryBuilder<T,R>>;

        constructor(query: T, parent?: Class<IBaseQueryBuilder<T,R>>) {
            super(query);
            this.parent = parent;
        }

        setParent(parent: Class<IBaseQueryBuilder<T,R>>) {
            this.parent = parent;
        }
    }