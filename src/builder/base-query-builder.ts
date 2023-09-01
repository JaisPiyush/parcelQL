import { Knex } from 'knex';
import { ParcelQLExpression } from '../schema/column-expression/base-column-expression';

export interface IBaseQueryBuilder<T, R = Knex.Raw> {
    build(knex: Knex): R;
    validateQuery(raiseException?: boolean): boolean;
    isQuerySchemaSupported(): boolean;
}

export class BaseQueryBuilder<
    T extends ParcelQLExpression = ParcelQLExpression,
    R = Knex.Raw
> implements IBaseQueryBuilder<T, R>
{
    constructor(protected readonly query: T) {}

    /**
     * Hook called just before building the query
     * Primarily used for preparing the states of the builder
     * @param knex - Knex
     */
    protected beforeBuild(knex: Knex): void {}

    /**
     * Hook called just before `validateQuery` the query
     * Primarily used for preparing the states before validation
     * @param knex - Knex
     */
    protected beforeValidatingQuery(knex: Knex): void {}

    /**
     * Main query building goes here.
     * @param knex - Knex
     */
    protected _build(knex: Knex): R {
        throw new Error('Not implemented');
    }

    // Method used to check that schema can be parsed by this builder
    // Used in composite design pattern
    public isQuerySchemaSupported(): boolean {
        return this.validateQuery();
    }

    public build(knex: Knex): R {
        this.beforeValidatingQuery(knex);
        this._validateQuery();
        this.beforeBuild(knex);
        return this._build(knex);
    }

    public getQuery(): T {
        return this.query;
    }

    /**
     * Checks if the query is provisioned to be built by this builder
     * This function will also be used to validate the query before calling the `beforeBuild` and `_build` functions
     * @param query - Query to be checked
     */
    public validateQuery(raiseException = false): boolean {
        try {
            this._validateQuery();
            return true;
        } catch (error) {
            if (raiseException) throw error;
            return false;
        }
    }

    protected _validateQuery() {}
}
