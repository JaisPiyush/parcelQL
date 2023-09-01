import { ParcelQLValidationError } from '../../../error';
import { BaseQueryBuilder } from '../../base-query-builder';
import { Knex } from 'knex';

/**
 * This class is used to build a value expression for query
 *
 * any value which is not an object will be treated as a raw value and
 * will be passed to knex.raw on '?'
 *
 * any string value with 'col:' prefix will be treated as a column name
 * and will be passed to knex.raw on '??'
 *
 * any object value will throw error
 */
export class ParcelQLValueExpressionBuilder extends BaseQueryBuilder<any> {
    protected _validateQuery(): void {
        if (this.query !== null && typeof this.query === 'object') {
            throw new Error('Value expression cannot be an object');
        }

        if (this.query === undefined) {
            throw new ParcelQLValidationError('Value expression cannot be undefined');
        }
    }

    protected _build(knex: Knex): Knex.Raw {
        if (typeof this.query === 'string' && this.query.startsWith('col:')) {
            return knex.raw('??', [this.query.slice(4)]);
        }
        return knex.raw('?', [this.query]);
    }
}
