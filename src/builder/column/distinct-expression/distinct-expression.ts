import { ParcelQLError, ParcelQLValidationError } from '../../../error';
import { ParcelQLDistinctExpression } from '../../../schema/column-expression/base-column-expression';
import { IBaseQueryBuilder } from '../../base-query-builder';
import { BaseColumnBuilder } from '../base-column-builder';
import { Knex } from 'knex';
import { ParcelQLValueExpressionBuilder } from '../value-expression';

export class ParcelQLDistinctExpressionBuilder extends BaseColumnBuilder<ParcelQLDistinctExpression> {
    private cols: IBaseQueryBuilder<any, any>[] = [];

    public isQuerySchemaSupported(): boolean {
        if (this.query.distinct && Array.isArray(this.query.distinct)) {
            return true;
        }
        return false;
    }

    protected beforeValidatingQuery(knex: Knex<any, any[]>): void {
        if (!this.parent) throw new ParcelQLError(`Parent builder is not set`);
        for (const col of this.query.distinct) {
            if (typeof col === 'string') {
                this.cols.push(
                    new this.parent({ column: col }, this.parent, [
                        ParcelQLValueExpressionBuilder.name
                    ])
                );
            } else {
                this.cols.push(
                    new this.parent(col, this.parent, [
                        ParcelQLValueExpressionBuilder.name
                    ])
                );
            }
        }
    }

    protected _validateQuery(): void {
        if (this.isQuerySchemaSupported()) {
            if (this.query.distinct.length === 0) {
                throw new ParcelQLValidationError(
                    `Distinct expression must have at least one column`
                );
            }
        } else {
            throw new ParcelQLValidationError(
                `Distinct expression must have distinct property`
            );
        }
    }

    protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
        return knex.raw(
            `distinct(${this.cols.map((col) => '??').join(', ')})`,
            this.cols.map((col) => col.build(knex))
        );
    }
}
