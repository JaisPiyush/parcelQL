import { Knex } from 'knex';
import { ParcelQLError, ParcelQLValidationError } from '../../../error';
import { ParcelQLSimpleColumnExpressionWithType } from '../../../schema/column-expression/base-column-expression';
import { ParcelQLTypeCastExpression } from '../simple-type-cast-expression';
import { BaseQueryBuilder } from '../../base-query-builder';

export class ParcelQLSimpleColumnExpressionBuilder extends BaseQueryBuilder<ParcelQLSimpleColumnExpressionWithType> {
    public isQuerySchemaSupported(): boolean {
        return (
            (this.query.column !== undefined && this.query.column !== null) ||
            (Array.isArray(this.query.column as string[]) &&
                (this.query.column as string[]).length > 0)
        );
    }

    protected _validateQuery() {
        if (
            this.query.column === undefined ||
            this.query.column === null ||
            this.query.column.length === 0
        ) {
            throw new ParcelQLValidationError(
                `column value "${this.query.column}" is not valid`
            );
        }
    }

    private _buildSingleColumn(col: string): [string, Knex.RawBinding[]] {
        if (typeof col === 'string') {
            return ['??', [col]];
        }
        throw new ParcelQLError(`column value must be string, sent ${col}`);
    }

    private _buildJSONExtractColumn(
        col: string[]
    ): [string, Knex.RawBinding[]] {
        if (col.length === 1) {
            return this._buildSingleColumn(col[0]);
        }
        const parameters: string[] = [];
        const expression: string[] = col
            .slice(0, col.length - 1)
            .map((c, index) => {
                parameters.push(c);
                if (index === 0) {
                    return '??';
                }
                return '?';
            });
        const query = `(${expression.join('->')}->>?)`;
        parameters.push(col[col.length - 1]);
        return [query, parameters];
    }

    protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
        // eslint-disable-next-line prefer-const
        let [query, params] =
            typeof this.query.column === 'string'
                ? this._buildSingleColumn(this.query.column)
                : this._buildJSONExtractColumn(this.query.column);
        if (this.query.type) {
            const typeBuilder = new ParcelQLTypeCastExpression(
                this.query.type as any
            );
            const typeString = typeBuilder.build(knex).toQuery();
            query += typeString;
        }
        return knex.raw(query, params);
    }
}
