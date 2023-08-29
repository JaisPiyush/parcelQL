import { expect } from 'chai';
import _knex, { Knex } from 'knex';

describe('Testing ParcelQLTimestampExpressionBuilder', () => {
    let knex: Knex;

    before(() => {
        knex = _knex({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            },
            useNullAsDefault: true
        });
    });

    after(async () => {
        await knex.destroy();
    });

    it('should return time with special value', () => {
    });
});