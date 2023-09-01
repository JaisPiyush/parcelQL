import { ParcelQLAggregateExpression } from './aggregate-expression';
import {
    ParcelQLSimpleColumnExpressionWithType,
    ParcelQLCaseWhenExpression,
    ParcelQLDistinctExpression,
    ParcelQLOperatorExpression,
    ParcelQLOperators
} from './base-column-expression';
import { ParcelQLDateTimeExpression } from './datetime-expression';
import { ParcelQLWindowExpression } from './window-expression';

export type ParcelQLColumnExpression = { alias?: string } & (
    | ParcelQLSimpleColumnExpressionWithType
    | ParcelQLCaseWhenExpression
    | ParcelQLDistinctExpression
    | ParcelQLDateTimeExpression
    | ParcelQLAggregateExpression
    | ParcelQLWindowExpression
    | ParcelQLOperatorExpression<ParcelQLOperators>
);
