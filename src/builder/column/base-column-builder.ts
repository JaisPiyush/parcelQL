import { Knex } from "knex";
import { ParcelQLExpression } from "../../schema/column-expression/base-column-expression";
import { BaseQueryBuilder, IBaseQueryBuilder } from "../base-query-builder";

type Class<T> = Function & { prototype: T };

export class BaseColumnBuilder<T extends ParcelQLExpression = ParcelQLExpression,R = Knex.Raw> extends
    BaseQueryBuilder<T,R> {

        protected readonly parent: Class<IBaseQueryBuilder<T,R>>;

        constructor(query: T, parent: Class<IBaseQueryBuilder<T,R>>) {
            super(query);
            this.parent = parent;
        }
    }