export const parcelQLComparisonOperators = [
    '=',
    '>',
    '<',
    '>=',
    '<=',
    '<>'
] as const;

export const parcelQLCollectionOperators = [
    'in',
    'like',
    'ilike',
    'similar'
] as const;

export const parcelQLJSONBComparisonOperators = [
    '@>',
    '<@',
    '?',
    '?|',
    '?&'
] as const;

export const parcelQLSubqueryExpressionOperator = [
    'exists',
    'any',
    'all',
    'some',
    'in',
    'not in'
] as const;

//TODO: add support for subquery expression

export interface ParcelQLFilter {}
