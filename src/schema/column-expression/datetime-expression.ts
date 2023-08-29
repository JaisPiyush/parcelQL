import {
    ParcelQLExpression,
    ParcelQLFunctionExpression
} from './base-column-expression';
import {
    parcelQLDateTimeFunctions,
    parcelQLSpecialValuesTimeExpression,
    parcelQLTimeExpressionDataTypes
} from '../constants';

export type ParcelQLSpecialValuesTimeExpression =
    (typeof parcelQLSpecialValuesTimeExpression)[number];

type ParcelQLDateTimeFunctions =
    | (typeof parcelQLDateTimeFunctions)[number]
    | 'extract'
    | 'date_trunc';

export type ParcelQLDateTimeExpression = ParcelQLFunctionExpression<
    ParcelQLDateTimeFunctions,
    ParcelQLExpression
>;

export type ParcelQLTimestampExpression = ParcelQLFunctionExpression<
    typeof parcelQLTimeExpressionDataTypes[number],
    ParcelQLSpecialValuesTimeExpression | string
>