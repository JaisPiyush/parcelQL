import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLColumnBuilder } from '..';
import { ParcelQLCaseWhenExpression } from '../../../schema/column-expression/base-column-expression';

describe('Test ParcelQLCaseWhenBuilder', () => {
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

    // Test multiple cases
    it('should pass', () => {
        const args: ParcelQLCaseWhenExpression = {
            cases: [
                {
                    when: { leftExpr: 'col:a', operator: '>', rightExpr: 2 },
                    then: 4
                },
                {
                    when: { leftExpr: 'col:b', operator: '<', rightExpr: 3 },
                    then: 5
                }
            ],
            else: 0
        };

        const builder = new ParcelQLColumnBuilder(args);
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.eq(
            'case when (`a` > ?) then ? when (`b` < ?) then ? else ? end'
        );
        expect(sql.bindings).to.eql([2, 4, 3, 5, 0]);
    });
    it('should return column in then', () => {
        const args: ParcelQLCaseWhenExpression = {
            cases: [
                {
                    when: { leftExpr: 'col:a', operator: '>', rightExpr: 2 },
                    then: 4
                },
                {
                    when: { leftExpr: 'col:b', operator: '<', rightExpr: 3 },
                    then: 5
                }
            ],
            else: 'col:r' 
        };

        const builder = new ParcelQLColumnBuilder(args);
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.eq(
            'case when (`a` > ?) then ? when (`b` < ?) then ? else `r` end'
        );
        expect(sql.bindings).to.eql([2, 4, 3, 5]);
    });
});
