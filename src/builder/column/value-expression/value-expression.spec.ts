import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLValueExpressionBuilder } from './value-expression';

describe('Testing ParcelQLValueExpressionBuilder', () => {
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

    it('should throw error if query is an object', () => {
        const builder = new ParcelQLValueExpressionBuilder({});
        expect(() => builder.build(knex)).to.throw(
            'Value expression cannot be an object'
        );
    });

    it('should return raw value if query is not an object', () => {
        const builder = new ParcelQLValueExpressionBuilder(1);
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.equal('?');
        expect(sql.bindings).to.eql([1]);
    });

    it('should return raw value if query is `null`', () => {
        const builder = new ParcelQLValueExpressionBuilder(null);
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.equal('?');
        expect(sql.bindings).to.eql([null]);
    });

    it('should return column value if query is prefixed with col:', () => {
        const builder = new ParcelQLValueExpressionBuilder('col:column');
        const sql = builder.build(knex).toSQL();
        expect(sql.sql).to.equal('`column`');
    });
});
