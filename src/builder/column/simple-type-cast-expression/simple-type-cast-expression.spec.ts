import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLTypeCastExpression } from './simple-type-cast-expression';

describe('Testing ParcelQLColumnTypeCastExpression', () => {
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

    it('should throw error on wrong data type', () => {
        const builder = new ParcelQLTypeCastExpression('number' as any);
        expect(() => {
            builder.isProvisionedQuery(true);
        }).to.throw(`column typecasting to "number" is not valid`)
    });
    it ('should pass on undefined data', () => {
        const builder = new ParcelQLTypeCastExpression(undefined);
        expect(builder.build(knex).toQuery()).eq('');
    })
    it('should build single type cast', () => {
        const builder = new ParcelQLTypeCastExpression('decimal');
        expect(builder.build(knex).toQuery()).eq('::decimal');
    });
    it('should build array type cast', () => {
        const builder = new ParcelQLTypeCastExpression(['decimal', 'bigint']);
        expect(builder.build(knex).toQuery()).eq('::decimal::bigint');
    });


});