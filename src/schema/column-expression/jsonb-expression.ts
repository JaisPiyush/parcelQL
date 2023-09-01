import { parcelQLJSONBFunctions } from '../constants';
import {
    ParcelQLExpression,
    ParcelQLFunctionExpression
} from './base-column-expression';

export type ParcelQLJSONBFunctions = (typeof parcelQLJSONBFunctions)[number];

export type ParcelQLJSONBFunctionExpression = ParcelQLFunctionExpression<
    ParcelQLJSONBFunctions,
    ParcelQLExpression
>;
