import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLTimestampExpressionBuilder } from './timestamp-expression';

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

    it('should throw error on wrong timestamp expression', () => {
        const builder = new ParcelQLTimestampExpressionBuilder({
            name: 'timer' as any,
            parameters: ['now']
        });
        expect(() => {
            builder.build(knex);
        }).to.throw('timestamp function name "timer" is not valid');
    });

    it('should return time with special value', () => {
        const builder = new ParcelQLTimestampExpressionBuilder({
            name: 'time',
            parameters: ['now']
        });
        const build = builder.build(knex);
        const sql = build.toSQL();
        expect(sql.sql).to.equal('time ?');
        expect(sql.bindings).to.deep.equal(['now']);
    });

    it('should return time with tz and special value', () => {
        const builder = new ParcelQLTimestampExpressionBuilder({
            name: 'timetz',
            parameters: ['now']
        });
        const build = builder.build(knex);
        const sql = build.toSQL();
        expect(sql.sql).to.equal('time ? with time zone');
        expect(sql.bindings).to.deep.equal(['now']);
    });
});
