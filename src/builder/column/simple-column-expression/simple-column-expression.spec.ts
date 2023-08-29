import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLSimpleColumnExpressionBuilder } from './simple-column-expression';

describe('Testing ParcelQLSimpleColumnExpressionBuilder', () => {
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

    // Test error on undefined or null or empty array column
    it('should through error due to invalid column value', () => {
        // Undefined column
        expect(() => {
            const builder = new ParcelQLSimpleColumnExpressionBuilder({} as any);
            builder.build(knex);
        }).to.throw(`column value "undefined" is not valid`);
        expect(() => {
            const builder = new ParcelQLSimpleColumnExpressionBuilder({ column: null } as any);
            builder.build(knex);
        }).to.throw(`column value "null" is not valid`);
        expect(() => {
            const builder = new ParcelQLSimpleColumnExpressionBuilder({ column: '' });
            builder.build(knex);
        }).to.throw(`column value "" is not valid`);
        expect(() => {
            const builder = new ParcelQLSimpleColumnExpressionBuilder({ column: [] });
            builder.build(knex);
        }).to.throw(`column value "" is not valid`);
    });
    // Test error on null or non-string type
    it('should through error due to invalid type value', () => {
        expect(() => {
            const builder = new ParcelQLSimpleColumnExpressionBuilder({
                column: 'a',
                type: true as any
            });
            builder.build(knex);
        }).to.throw(`column typecasting to "true" is not valid`);
    });
    // Test column as string without typecasting
    it('should build the query for single value string', () => {
        const colBuilder = new ParcelQLSimpleColumnExpressionBuilder({
            column: 'a'
        });
        const raw = colBuilder.build(knex);
        const sql = raw.toSQL();
        expect(sql.sql).to.eq('`a`');
        expect(sql.bindings).to.eql([]);
    });
    // Test column as string[] with single element without typecasting
    it('should build the query for single value in string array', () => {
        const colBuilder = new ParcelQLSimpleColumnExpressionBuilder({
            column: ['a']
        });
        const raw = colBuilder.build(knex);
        const sql = raw.toSQL();
        expect(sql.sql).to.eq('`a`');
        expect(sql.bindings).to.eql([]);
    });
    // Test json extract column without typecasting
    it('should build the query for json extract', () => {
        const colBuilder = new ParcelQLSimpleColumnExpressionBuilder({
            column: ['a', 'b', 'c']
        });
        const raw = colBuilder.build(knex);
        const sql = raw.toSQL();
        expect(sql.sql).to.eq('(`a`->?->>?)');
        expect(sql.bindings).to.eql(['b', 'c']);
    });
    // Test typecast should throw error on invalid type
    it('should throw error for the single string value column with invalid typecasting', () => {
        const colBuilder = new ParcelQLSimpleColumnExpressionBuilder({
            column: 'a',
            type: 'number' as any
        });
        expect(() => {
            colBuilder.build(knex);
        }).to.throw(`column typecasting to "number" is not valid`);
    });
    // Test column as string with typecasting
    it('should build the query for single value string', () => {
        const colBuilder = new ParcelQLSimpleColumnExpressionBuilder({
            column: 'a',
            type: 'boolean'
        });
        const raw = colBuilder.build(knex);
        const sql = raw.toSQL();
        expect(sql.sql).to.eq('`a`::boolean');
        expect(sql.bindings).to.eql([]);
    });

    // Test column as json extract with typecasting
    it('should build the query for json extract', () => {
        const colBuilder = new ParcelQLSimpleColumnExpressionBuilder({
            column: ['a', 'b', 'c'],
            type: ['text', 'bigint']
        });
        const raw = colBuilder.build(knex);
        const sql = raw.toSQL();
        expect(sql.sql).to.eq('(`a`->?->>?)::text::bigint');
        expect(sql.bindings).to.eql(['b', 'c']);
    });
});
