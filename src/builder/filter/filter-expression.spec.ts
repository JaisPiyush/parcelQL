import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLFilterBuilder } from './filter-expression';

describe('Test ParcelQLFilterBuilder', () => {
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

    // Test empty filter should throw error
    it('should throw error due to empty filter', () => {
        expect(() => {
            const builder = new ParcelQLFilterBuilder({} as any);
            builder.build(knex)
        }).to.throw(
            `Invalid filter expression: ${JSON.stringify({})}`
        );
    });
    // Test CompFilter
    it('should pass the normal CompFilter', () => {
        const builder = new ParcelQLFilterBuilder({
            leftExpr: 'col:nftType',
            operator: '>',
            rightExpr: 2
        });
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.eq('(`nftType` > ?)');
        expect(sql.bindings).to.eql([2]);
    });
    // Test AND based filter
    it('should pass AND chained filters', () => {
        const builder = new ParcelQLFilterBuilder({
            and: [
                {
                    leftExpr: 'col:nftType',
                    operator: '>',
                    rightExpr: 2
                },
                {
                    leftExpr: 'col:nftType',
                    operator: '<',
                    rightExpr: 8
                }
            ]
        });
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.eq('((`nftType` > ?) and (`nftType` < ?))');
        expect(sql.bindings).to.eql([2, 8]);
    });
    // Test OR based filter
    it('should pass OR chained filters', () => {
        const builder = new ParcelQLFilterBuilder({
            or: [
                {
                    leftExpr: 'col:nftType',
                    operator: '>',
                    rightExpr: 2
                },
                {
                    leftExpr: 'col:nftType',
                    operator: '<',
                    rightExpr: 8
                }
            ]
        });
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.eq('((`nftType` > ?) or (`nftType` < ?))');
        expect(sql.bindings).to.eql([2, 8]);
    });
    // Test deep chained filter
    it('should pass AND-OR  deep-chained filters', () => {
        const builder = new ParcelQLFilterBuilder({
            and: [
                {
                    leftExpr: 'col:nftType',
                    operator: '>',
                    rightExpr: 2
                },
                {
                    leftExpr: 'col:nftType',
                    operator: '<',
                    rightExpr: 8
                },
                {
                    or: [
                        {
                            leftExpr: 'col:salePrice',
                            operator: '<',
                            rightExpr: 10
                        },
                        {
                            leftExpr: 'col:salePrice',
                            operator: '>',
                            rightExpr: 30
                        }
                    ]
                }
            ]
        });
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.eq(
            '((`nftType` > ?) and (`nftType` < ?) and ((`salePrice` < ?) or (`salePrice` > ?)))'
        );
        expect(sql.bindings).to.eql([2, 8, 10, 30]);
    });
});
