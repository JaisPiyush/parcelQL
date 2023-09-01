import { Knex } from "knex";
import { ParcelQLColumnExpression } from "../../schema/column-expression";
import { BaseColumnBuilder } from "./base-column-builder";
import { ParcelQLTimestampExpressionBuilder } from "./timestamp-expression";
import { BaseQueryBuilder } from "../base-query-builder";
import { ParcelQLSimpleColumnExpressionBuilder } from "./simple-column-expression";
import { ParcelQLValueExpressionBuilder } from "./value-expression";
import { ParcelQLValidationError } from "../../error";
import { ParcelQLOperatorBuilder } from "./operator-expression.ts/operator-expression";

export class ParcelQLColumnBuilder 
    extends BaseColumnBuilder<ParcelQLColumnExpression> {

        // Order of the builders is important
        // The first builder will have the highest priority
        private childBuilders = [
            ParcelQLOperatorBuilder,
            ParcelQLTimestampExpressionBuilder,
            ParcelQLSimpleColumnExpressionBuilder,
            ParcelQLValueExpressionBuilder
        ]

        private selectedBuilder: BaseQueryBuilder | undefined;

        private baseColumnBuilders = [
            ParcelQLTimestampExpressionBuilder.name,
            ParcelQLSimpleColumnExpressionBuilder.name,
            ParcelQLValueExpressionBuilder.name
        ]

        protected beforeValidatingQuery(knex: Knex<any, any[]>): void {
            for (const builder of this.childBuilders) {
                const instance = new builder(this.query);
                // console.log(`${instance.constructor.name} is supported: ${instance.isQuerySchemaSupported()}`);
                if (instance.isQuerySchemaSupported()) {
                    this.selectedBuilder = instance;
                    return;
                }
            }
        }

        protected _validateQuery(): void {
            if (!this.selectedBuilder) {
                throw new ParcelQLValidationError('Invalid column expression');
            }
        }

        protected _build(knex: Knex<any, any[]>): Knex.Raw<any> {
            if (!this.selectedBuilder) {
                throw new ParcelQLValidationError('Invalid column expression');
            }
            if (!this.baseColumnBuilders.includes(this.selectedBuilder.constructor.name)) {
                (this.selectedBuilder as BaseColumnBuilder).setParent(this.constructor as any);
            }
            return this.selectedBuilder?.build(knex);
        }
    }