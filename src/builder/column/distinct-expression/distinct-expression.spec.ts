import { expect } from 'chai';
import _knex, { Knex } from 'knex';
import { ParcelQLColumnBuilder } from '../column-builder';


describe('Testing ParcelQLDistinctExpressionBuilder', () => {
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

    it('should create distinct function', () => { 
        const builder = new ParcelQLColumnBuilder({
            distinct: [
                'name',
                {column: 'age', alias: 'age'}
            ]
        });

        const sql = builder.build(knex).toSQL();
        console.log(sql)
        expect(sql.sql).to.equal('distinct(`name`, `age` as `age`)');
     });
});