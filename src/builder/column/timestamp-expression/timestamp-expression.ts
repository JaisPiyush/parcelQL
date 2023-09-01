import { ParcelQLValidationError } from "../../../error";
import { ParcelQLTimestampExpression } from "../../../schema/column-expression/datetime-expression";
import { parcelQLTimeExpressionDataTypes } from "../../../schema/constants";
import { BaseQueryBuilder } from "../../base-query-builder";
import {Knex} from "knex";

export class ParcelQLTimestampExpressionBuilder extends
    BaseQueryBuilder<ParcelQLTimestampExpression> {

        protected _validateQuery(): void {
            if (!parcelQLTimeExpressionDataTypes.includes(this.query.name)) {
                throw new ParcelQLValidationError(
                    `timestamp function name "${this.query.name}" is not valid`
                );
            }

            if (Array.isArray(this.query.parameters) && this.query.parameters.length > 1) {
                throw new ParcelQLValidationError(
                    `timestamp function "${this.query.name}" only accepts one parameter`
                );
            }
        }

        protected _build(knex: Knex): Knex.Raw {
            const parameters: string[] = 
                Array.isArray(this.query.parameters) ? this.query.parameters : [this.query.parameters];
            
            if (this.query.name.includes('tz')) {
                return knex.raw(`${this.query.name.replace("tz", "")} ? with time zone`, parameters);
            }
            return knex.raw(`${this.query.name} ?`, parameters);
        }
    }