import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLColumnBuilder } from '../column-builder';
import { ParcelQLOperatorBuilder } from './operator-expression';

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
            operator: 'not as' as any,
            rightExpr: 'named'
        });

        expect(() => {
            builder.build(knex);
        }).to.throw('Operator "not as" is not supported');
    });
    it('should throw error on undefined parent', () => {
        const builder = new ParcelQLOperatorBuilder({
            leftExpr: 'name',
            operator: 'not in',
            rightExpr: 'named'
        });

        expect(() => {
            builder.build(knex);
        }).to.throw('Parent builder is not set');
    });
    it('should create query for value and value operation', () => {
        const builder = new ParcelQLColumnBuilder({
            leftExpr: 'name',
            operator: 'not in',
            rightExpr: 'named'
        });

        const query = builder.build(knex);
        const sql = query.toSQL();
        expect(sql.sql).to.eq('? not in ?');
        expect(sql.bindings).to.eql(['name', 'named']);
    });

    it('should create query for column and value operation', () => {
        const builder = new ParcelQLColumnBuilder({
            leftExpr: {
                column: 'name'
            },
            operator: '>',
            rightExpr: 2
        });

        const query = builder.build(knex);
        const sql = query.toSQL();
        expect(sql.sql).to.eq('`name` > ?');
        expect(sql.bindings).to.eql([2]);
    });
    it('should create query for value and column operation', () => {
        const builder = new ParcelQLColumnBuilder({
            rightExpr: {
                column: 'name'
            },
            operator: '>',
            leftExpr: 2
        });

        const query = builder.build(knex);
        const sql = query.toSQL();
        expect(sql.sql).to.eq('? > `name`');
        expect(sql.bindings).to.eql([2]);
    });
    it('should create query for column and column operation', () => {
        const builder = new ParcelQLColumnBuilder({
            leftExpr: {
                column: 'name'
            },
            operator: '>',
            rightExpr: {
                column: 'age'
            }
        });

        const query = builder.build(knex);
        const sql = query.toSQL();
        expect(sql.sql).to.eq('`name` > `age`');
    });

    it('should create query for column and column operation using value expression col prefix', () => {
        const builder = new ParcelQLColumnBuilder({
            leftExpr: 'col:name',
            operator: '>',
            rightExpr: 'col:age'
        });

        const query = builder.build(knex);
        const sql = query.toSQL();
        expect(sql.sql).to.eq('`name` > `age`');
    });
    it('should create query for column and column operation with timestmap expression', () => {
        const builder = new ParcelQLColumnBuilder({
            leftExpr: {
                name: 'timestamp',
                parameters: ['now']
            },
            operator: '>',
            rightExpr: 2
        });

        const query = builder.build(knex);
        const sql = query.toSQL();
        expect(sql.sql).to.eq('timestamp ? > ?');
        expect(sql.bindings).to.eql(['now', 2]);
    });
});
