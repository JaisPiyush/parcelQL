import { ParcelQLColumnExpression } from '.';
import {
    parcelQLSupportedTypeCast,
    parcelQLArithmeticOperators,
    parcelQLJSONBOperator,
    parcelQLCollectionComparisonOperators
} from '../constants';
import {
    parcelQLSubqueryExpressionOperator,
    parcelQLComparisonOperators,
    parcelQLJSONBComparisonOperators
} from '../filter-expression';

export interface ParcelQLExpression {}

export type ParcelQLSupportedTypeCast =
    (typeof parcelQLSupportedTypeCast)[number];

export type ParcelQLSimpleColumnExpression = string | string[];

export interface ParcelQLSimpleColumnExpressionWithType
    extends ParcelQLExpression {
    column: ParcelQLSimpleColumnExpression;
    type?: ParcelQLSupportedTypeCast | ParcelQLSupportedTypeCast[];
}

export type ParcelQLOperators =
    | (typeof parcelQLArithmeticOperators)[number]
    | (typeof parcelQLJSONBOperator)[number]
    | ParcelQLComparisonOperators
    | (typeof parcelQLSubqueryExpressionOperator)[number];

export interface ParcelQLOperatorExpression<O, L = any, R = any >
    extends ParcelQLExpression {
    leftExpr: L | ParcelQLOperatorExpression<L | any, O> | unknown;
    operator: O;
    rightExpr: R | ParcelQLOperatorExpression<R | any, O> | unknown;
}

export type ParcelQLComparisonOperators =
    | (typeof parcelQLComparisonOperators)[number]
    | (typeof parcelQLCollectionComparisonOperators)[number]
    | (typeof parcelQLJSONBComparisonOperators)[number];

export type ParcelQLFilterExpression =
    | { and: ParcelQLFilterExpression[] }
    | { or: ParcelQLFilterExpression[] }
    | { not: ParcelQLFilterExpression }
    | ParcelQLOperatorExpression<
          ParcelQLExpression,
          ParcelQLComparisonOperators
      >;

export interface ParcelQLCaseExpression extends ParcelQLExpression {
    when: ParcelQLFilterExpression;
    then: unknown | ParcelQLSimpleColumnExpressionWithType;
}

export interface ParcelQLCaseWhenExpression extends ParcelQLExpression {
    cases: ParcelQLCaseExpression[];
    else: unknown | ParcelQLSimpleColumnExpressionWithType;
}

export interface ParcelQLDistinctExpression extends ParcelQLExpression {
    distinct: ParcelQLColumnExpression[];
}

export interface ParcelQLFunctionExpression<N, E = ParcelQLExpression>
    extends ParcelQLExpression {
    name: N;
    parameters?: E | E[] | unknown;
}
