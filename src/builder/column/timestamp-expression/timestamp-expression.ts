import { ParcelQLTimestampExpression } from "../../../schema/column-expression/datetime-expression";
import { parcelQLTimeExpressionDataTypes } from "../../../schema/constants";
import { BaseQueryBuilder } from "../../base-query-builder";
import {Knex} from "knex";

export class ParcelQLTimestampExpressionBuilder extends
    BaseQueryBuilder<ParcelQLTimestampExpression> {

        protected _isProvisionedQuery(): void {
            if (!parcelQLTimeExpressionDataTypes.includes(this.query.name)) {
                throw new Error(
                    `timestamp function name "${this.query.name}" is not valid`
                );
            }
        }

        protected _build(knex: Knex): Knex.Raw {
            const parameters: string[] = [];
            if (Array.isArray(this.query.parameters)) {
                parameters
            }
        }
    }