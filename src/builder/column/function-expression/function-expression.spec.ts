import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLColumnBuilder } from '..';

describe('Testing ParcelQLFunctionBuilder', () => {
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

    it('should throw error if function name is not supported', () => {
        const builder = new ParcelQLColumnBuilder({
            name: 'not-supported-function' as any
        });

        expect(() => builder.build(knex)).to.throw('Invalid column expression');
    })
    it('should throw error if parameters are not correct for extract function', () => {
        

        expect(() => {
            const builder = new ParcelQLColumnBuilder({
                name: 'extract',
                parameters: ['day']
            });
            builder.build(knex)
        }).to.throw('extract function requires 2 parameters');

        expect(() => {
            const builder = new ParcelQLColumnBuilder({
                name: 'extract',
                parameters: ['not-supported', 'col:arg']
            });
            builder.build(knex)
        }).to.throw('extract field "not-supported" is not supported');
    
    });
    
    it('should build function without parenthesis', () => {
        const builder = new ParcelQLColumnBuilder({
            name: 'current_date'
        });

        expect(builder.build(knex).toSQL().sql).to.equal('current_date');
    });
    it('should build function with parenthesis', () => {
        const builder = new ParcelQLColumnBuilder({
            name: 'now',
        });

        expect(builder.build(knex).toSQL().sql).to.equal('now()');
    });
    it('should build function with parameters', () => {
        const builder = new ParcelQLColumnBuilder({
            name: 'date_trunc',
            parameters: ['day', 'col:arg', 'col:arg2']
        });

        expect(builder.build(knex).toSQL().sql).to.equal('date_trunc(?, `arg`, `arg2`)');
    });

    it('should build extract function', () => {
        const builder = new ParcelQLColumnBuilder({
            name: 'extract',
            parameters: ['day', 'col:arg']
        });

        expect(builder.build(knex).toSQL().sql).to.equal('extract(? from `arg`)');
    });

});