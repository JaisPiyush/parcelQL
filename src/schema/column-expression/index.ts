import { ParcelQLAggregateExpression } from './aggregate-expression';
import {
    ParcelQLSimpleColumnExpression,
    ParcelQLSimpleColumnExpressionWithType,
    ParcelQLCaseWhenExpression,
    ParcelQLDistinctExpression
} from './base-column-expression';
import { ParcelQLDateTimeExpression } from './datetime-expression';
import { ParcelQLWindowExpression } from './window-expression';

export type ParcelQLColumnExpression =
    | ParcelQLSimpleColumnExpression
    | ParcelQLSimpleColumnExpressionWithType
    | ParcelQLCaseWhenExpression
    | ParcelQLDistinctExpression
    | ParcelQLDateTimeExpression
    | ParcelQLAggregateExpression
    | ParcelQLWindowExpression;
