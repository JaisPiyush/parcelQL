import { ParcelQLExpression } from './column-expression';
import {
    parcelQLDateTimeFunctions,
    parcelQLSpecialValuesTimeExpression
} from './constants';

export type ParcelQLSpecialValuesTimeExpression =
    (typeof parcelQLSpecialValuesTimeExpression)[number];

type ParcelQLDateTimeFunctions =
    | (typeof parcelQLDateTimeFunctions)[number]
    | 'extract'
    | 'date_trunc';

export interface ParcelQLConstantTimeExpression extends ParcelQLExpression {
    name: ParcelQLDateTimeFunctions;
    expression?: ParcelQLSpecialValuesTimeExpression | string;
}
