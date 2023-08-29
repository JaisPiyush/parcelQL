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

//TODO: Add triviality to support either rightExpr or value
export interface ParcelQLOperatorExpression<T extends ParcelQLExpression, O>
    extends ParcelQLExpression {
    leftExpr: T | ParcelQLOperatorExpression<T | any, O>;
    operator: O;
    rightExpr?: T | ParcelQLOperatorExpression<T | any, O>;
    value?: unknown;
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
    columns: (
        | ParcelQLSimpleColumnExpressionWithType
        | ParcelQLSimpleColumnExpression
    )[];
}

export interface ParcelQLFunctionExpression<N, E = ParcelQLExpression>
    extends ParcelQLExpression {
    name: N;
    parameters?: E | E[] | unknown;
}
