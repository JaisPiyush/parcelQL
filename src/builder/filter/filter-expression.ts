import { Knex } from 'knex';
import { ParcelQLValidationError } from '../../error';
import {
    ParcelQLComparisonOperators,
    ParcelQLExpression,
    ParcelQLFilterExpression,
    ParcelQLOperatorExpression
} from '../../schema/column-expression/base-column-expression';
import { parcelQLComparisonOperators } from '../../schema/constants';
import { BaseQueryBuilder } from '../base-query-builder';
import { ParcelQLColumnBuilder } from '../column';

export class ParcelQLFilterBuilder extends BaseQueryBuilder<ParcelQLFilterExpression> {
    public isQuerySchemaSupported(): boolean {
        const query = this.query as any;
        if (query.and || query.or || query.not) {
            // Check that first key is the logical operator
            if (!['and', 'or', 'not'].includes(Object.keys(this.query)[0])) {
                return false;
            }
            return true;
        }
        if (
            query.leftExpr &&
            query.operator &&
            query.rightExpr &&
            parcelQLComparisonOperators.includes(query.operator)
        ) {
            return true;
        }
        return false;
    }

    protected _validateQuery(): void {
        if (!this.isQuerySchemaSupported()) {
            throw new ParcelQLValidationError(
                `Invalid filter expression: ${JSON.stringify(this.query)}`
            );
        }
    }

    private _buildOperatorExpression(
        knex: Knex,
        query: ParcelQLOperatorExpression<
            ParcelQLExpression,
            ParcelQLComparisonOperators
        >
    ): Knex.Raw {
        const operator = new ParcelQLColumnBuilder(query);
        return knex.raw('(??)', [operator.build(knex)]);
    }

    private _buildBooleanChainFilters(
        knex: Knex,
        ops: 'and' | 'or' | 'not',
        queries: ParcelQLFilterExpression[]
    ): Knex.Raw {
        const bindings: Knex.Raw[] = [];
        const query: string[] = [];

        for (const q of queries) {
            const filter = new ParcelQLFilterBuilder(q);
            bindings.push(filter.build(knex));
            query.push(`??`);
        }

        return knex.raw(`(${query.join(` ${ops} `)})`, bindings);
    }

    protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
        if ((this.query as any).operator) {
            return this._buildOperatorExpression(knex, this.query as any);
        }
        const ops = Object.keys(this.query)[0] as 'and' | 'or' | 'not';
        return this._buildBooleanChainFilters(
            knex,
            ops,
            (this.query as any)[ops] as ParcelQLFilterExpression[]
        );
    }
}
