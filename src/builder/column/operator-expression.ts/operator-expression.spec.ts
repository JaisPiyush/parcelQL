import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLColumnBuilder } from '../column-builder';

describe('Testing ParcelQLOperatorBuilder', () => {
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

    it('should throw error on wrong operator expression', () => {
        const builder = new ParcelQLColumnBuilder({
            leftExpr: 'name',
            operator: 'not as',
            rightExpr: 'named'
        });

        expect(() => {
            builder.build(knex);
        }).to.throw('Operator "not as" is not supported');
    });
    it('should throw error on undefined parent', () => {});
    it('should create query for column and column operation', () => {});
    it('should create query for column and value operation', () => {});
    it('should create query for value and column operation', () => {});
    it('should create query for value and value operation', () => {});
    it('should create query for column and column operation with timestmap expression', () => {});
});