import { Knex } from 'knex';
import { ParcelQLError, ParcelQLValidationError } from '../../../error';
import { ParcelQLColumnExpression } from '../../../schema/column-expression';
import { ParcelQLCaseExpression, ParcelQLCaseWhenExpression } from '../../../schema/column-expression/base-column-expression';
import { ParcelQLFilterBuilder } from '../../filter';
import { BaseColumnBuilder } from '../base-column-builder';

class ParcelQLCaseBuilder 
    extends BaseColumnBuilder<ParcelQLCaseExpression> {

        protected when?: ParcelQLFilterBuilder;

        public isQuerySchemaSupported(): boolean {
            if (
                this.query.when &&
                this.query.then
            ) return true;
            return false
        }

        protected _validateQuery(): void {
            if (!this.isQuerySchemaSupported()) {
                throw new ParcelQLValidationError(
                    'Invalid query schema for case expression'
                );
            }
            if ((this.query.then as ParcelQLColumnExpression).alias) {
                throw new ParcelQLValidationError(
                    'alias is not supported for case expression'
                );
            }
                
        }


        protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
            if (!this.parent) throw new ParcelQLError('Parent builder is not set');
            const when = new ParcelQLFilterBuilder(
                this.query.when
            );
            const then = new this.parent(
                this.query.then,
                this.parent
            );
            return knex.raw(
                `when ?? then ??`,
                [when.build(knex), then.build(knex)]
            );
        }
}

export class ParcelQLCaseWhenBuilder 
    extends BaseColumnBuilder<ParcelQLCaseWhenExpression> {

        public isQuerySchemaSupported(): boolean {
            if (
                this.query.cases &&
                this.query.cases.length
            ) return true;
            return false
        }

        protected _validateQuery(): void {
            if (!this.isQuerySchemaSupported()) {
                throw new ParcelQLValidationError(
                    'Invalid query schema for case when expression'
                );
            }
        }

        protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
            if (!this.parent) throw new ParcelQLError('Parent builder is not set');
            
            const cases = this.query.cases.map((c) => {
                return new ParcelQLCaseBuilder(c, this.parent);
            });
            
            const elseCase = this.query.else !== undefined ?
                knex.raw('else ??', [(new this.parent(this.query.else, this.parent)).build(knex)])
                : knex.raw('')
                
            const raw =  knex.raw(
                `case ${cases.map((c) => '??').join(' ')} ?? end`,
                [cases.map((c) => c.build(knex)), elseCase].flat()
            );
            return raw;
        }

}
