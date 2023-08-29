import { Knex } from 'knex';
import { ParcelQLExpression } from '../schema/column-expression/base-column-expression';

export class BaseQueryBuilder<T = ParcelQLExpression, R = Knex.Raw> {
    constructor(protected readonly query: T) {}

    /**
     * Hook called just before building the query
     * Primarily used for preparing the states of the builder
     * @param knex - Knex
     */
    protected beforeBuild(knex: Knex): void {}

    /**
     * Main query building goes here.
     * @param knex - Knex
     */
    protected _build(knex: Knex): R {
        throw new Error('Not implemented');
    }

    public build(knex: Knex): R {
        this._isProvisionedQuery();
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
    public isProvisionedQuery(raiseException = false): boolean {
        try {
            this._isProvisionedQuery();
            return true;
        } catch (error) {
            
            if (raiseException) throw error;
            return false;
        }
    }

    protected _isProvisionedQuery() {}
}
