import { Knex } from "knex";
import { ParcelQLError, ParcelQLValidationError } from "../../../error";
import { ParcelQLFunctionExpression } from "../../../schema/column-expression/base-column-expression";
import { ParcelQLFunctions, parcelQLDateTimeFunctions, parcelQLDateTimeFunctionsWithoutParenthesis, parcelQLExtractField, parcelQLJSONBFunctions } from "../../../schema/constants";
import { BaseColumnBuilder } from "../base-column-builder";

export class ParcelQLFunctionBuilder 
    extends BaseColumnBuilder<ParcelQLFunctionExpression<ParcelQLFunctions>> {

        private getAllFunctions(): string[] {
            return [
                ...parcelQLJSONBFunctions,
                ...parcelQLDateTimeFunctions
            ]
        }



        public isQuerySchemaSupported(): boolean {
            return this.validateQuery();
        }

        protected _validateQuery(): void {
            if (!this.query.name) {
                throw new ParcelQLValidationError('function name is required');
            }
            if (!this.getAllFunctions().includes(this.query.name)) {
                throw new ParcelQLValidationError(`function "${this.query.name}" is not supported`);
            }

            
        }

        private _buildParameters(knex: Knex<any, any[]>): Knex.Raw<any> {
            if (!this.parent) {
                throw new ParcelQLError('Parent is not set');
            }
            if (Array.isArray(this.query.parameters)) {
                const params = [];
                for (const param of this.query.parameters) {
                    const builder = new this.parent(param, this.parent)
                    params.push(builder.build(knex));
                    
                }
                return knex.raw(`${params.map((p) => '??').join(', ')}`, params);
            }
            return (new this.parent(this.query.parameters, this.parent)).build(knex);
        }

        protected _buildExtractFunction(knex: Knex): Knex.Raw {
            if (this.query.name === 'extract') {
                if (!this.query.parameters) {
                    throw new ParcelQLValidationError('parameters are required for extract function');
                }
                if (!Array.isArray(this.query.parameters) || this.query.parameters.length !== 2) {
                    throw new ParcelQLValidationError('extract function requires 2 parameters');
                }

                if (!parcelQLExtractField.includes(this.query.parameters[0])) {
                    throw new ParcelQLValidationError(`extract field "${this.query.parameters[0]}" is not supported`);
                }

            }
            if (!this.parent) {
                throw new ParcelQLError('Parent is not set');
            }
            const builder = new this.parent((this.query.parameters as any[])[1], this.parent);
            return knex.raw('extract(? from ??)', [(this.query.parameters as any[])[0], builder.build(knex)]);
        }

        protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
            if (this.query.name === 'extract') {
                return this._buildExtractFunction(knex);
            }
            if (parcelQLDateTimeFunctionsWithoutParenthesis.includes(this.query.name)) {
                return knex.raw(this.query.name);
            }
            if (this.query.parameters === undefined) {
                return knex.raw(`${this.query.name}()`);
            }
            const parameters = this._buildParameters(knex);
            return knex.raw(`${this.query.name}(??)`, [parameters]);
        }

}
