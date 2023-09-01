import { Knex } from 'knex';
import { ParcelQLValidationError } from '../../../error';
import {
    ParcelQLSimpleColumnExpressionWithType,
    ParcelQLSupportedTypeCast
} from '../../../schema/column-expression/base-column-expression';
import { parcelQLSupportedTypeCast } from '../../../schema/constants';
import { BaseQueryBuilder } from '../../base-query-builder';

export class ParcelQLTypeCastExpression extends BaseQueryBuilder<
    Required<ParcelQLSimpleColumnExpressionWithType>['type']
> {
    protected _validateQuery(): void {
        if (this.query) {
            if (!Array.isArray(this.query) && typeof this.query !== 'string') {
                throw new ParcelQLValidationError(
                    `column typecasting to "${this.query}" is not valid`
                );
            }
            const types: string[] = Array.isArray(this.query)
                ? this.query
                : [this.query];
            types.forEach((element) => {
                if (
                    !parcelQLSupportedTypeCast.includes(
                        element as ParcelQLSupportedTypeCast
                    )
                ) {
                    throw new ParcelQLValidationError(
                        `column typecasting to "${this.query}" is not valid`
                    );
                }
            });
        }
    }

    private _buildSingleTypeCast(t: ParcelQLSupportedTypeCast): string {
        return `::${t}`;
    }

    protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
        const types = Array.isArray(this.query) ? this.query : [this.query];
        let query = '';
        for (const type of types) {
            query += this._buildSingleTypeCast(type);
        }
        return knex.raw(query);
    }
}
