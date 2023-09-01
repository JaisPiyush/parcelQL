import { ParcelQLError, ParcelQLValidationError } from '../../../error';
import {
    ParcelQLOperatorExpression,
    ParcelQLOperators
} from '../../../schema/column-expression/base-column-expression';
import { parcelQLOperators } from '../../../schema/constants';
import { IBaseQueryBuilder } from '../../base-query-builder';
import { BaseColumnBuilder } from '../base-column-builder';
import { Knex } from 'knex';

export class ParcelQLOperatorBuilder extends BaseColumnBuilder<
    ParcelQLOperatorExpression<ParcelQLOperators>
> {
    private leftExpr?: IBaseQueryBuilder<any, any>;
    private rightExpr?: IBaseQueryBuilder<any, any>;

    public isQuerySchemaSupported(): boolean {
        if (this.query.leftExpr !== undefined && 
            this.query.rightExpr !== undefined && 
            this.query.operator)
            return true;
        return false;
    }

    protected _validateQuery(): void {
        if (this.isQuerySchemaSupported()) {
            if (!parcelQLOperators.includes(this.query.operator)) {
                throw new ParcelQLValidationError(
                    `Operator "${this.query.operator}" is not supported`
                );
            }
        } else {
            throw new ParcelQLValidationError(
                `Operator expression must have leftExpr, operator, and rightExpr`
            );
        }
    }

    protected beforeBuild(knex: Knex<any, any[]>): void {
        if (!this.parent) throw new ParcelQLError(`Parent builder is not set`);
        this.leftExpr = new this.parent(this.query.leftExpr, this.parent);
        this.rightExpr = new this.parent(this.query.rightExpr, this.parent);
    }

    protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
        return knex.raw(`?? ${this.query.operator} ??`, [
            this.leftExpr?.build(knex),
            this.rightExpr?.build(knex)
        ]);
    }
}
