export const parcelQLArithmeticOperators = [
    '+',
    '-',
    '*',
    '/',
    '%',
    '^'
] as const;

// Blocked support for '||', '#-', '-',  operators
export const parcelQLJSONBOperator = ['#>', '#>>'] as const;

export const parcelQLJSONBFunctions = [
    'jsonb_array_length',
    'jsonb_each',
    'jsonb_each_text',
    'jsonb_object_keys',
    'jsonb_array_elements',
    'jsonb_array_elements_text',
    'jsonb_strip_nulls'
] as const;

/// DATE TIME FUNCTIONS ///////////////////////////

export const parcelQLDateTimeFunctions = [
    'current_date',
    'current_time',
    'current_timestamp',
    'localtime',
    'localtimestamp',
    'age',
    'clock_timestamp',
    'date_trunc',
    'extract',
    'isfinite',
    'justify_days',
    'justify_hours',
    'justify_interval',
    'now',
    'statement_timestamp',
    'timeofday'
] as const;

export const parcelQLDateTimeFunctionsWithoutParenthesis = [
    'current_date',
    'current_time',
    'current_timestamp',
    'localtime',
    'localtimestamp'
];

export const parcelQLTimeInterval = [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'year to month',
    'day to hour',
    'day to minute',
    'day to second',
    'hour to minute',
    'hour to second',
    'minute to second'
] as const;

export const parcelQLDateTruncField = [
    'microseconds',
    'milliseconds',
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'quarter',
    'year',
    'decade',
    'century',
    'millennium'
] as const;

export const parcelQLExtractField = [
    'century',
    'day',
    'decade',
    'dow',
    'doy',
    'epoch',
    'hour',
    'isodow',
    'isoyear',
    'microseconds',
    'millennium',
    'milliseconds',
    'minute',
    'month',
    'quarter',
    'second',
    'timezone',
    'timezone_hour',
    'timezone_minute',
    'week',
    'year'
] as const;

export const parcelQLTimeExpressionDataTypes = [
    'time',
    'timestamp',
    'interval',
    'date',
    // timestamp [p] with time zone
    'timestamptz',
    // time [p] with time zone
    'timetz'
] as const;

export const parcelQLSpecialValuesTimeExpression = [
    'infinity',
    '-infinity',
    'now',
    'today',
    'tomorrow',
    'yesterday',
    'epoch',
    'allballs'
] as const;

export const parcelQLSupportedTypeCast = [
    'integer',
    'smallint',
    'double precision',
    'decimal',
    'bigint',
    'text',
    'boolean',
    'date',
    'time',
    'timestamp',
    'interval',
    'json',
    'jsonb'
] as const;

export const parcelQLComparisonOperators = [
    '=',
    '>',
    '<',
    '>=',
    '<=',
    '<>'
] as const;

export const parcelQLCollectionComparisonOperators = [
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

let parcelQLOperators: string[] = [];
parcelQLOperators = parcelQLOperators.concat([
    ...parcelQLArithmeticOperators,
    ...parcelQLJSONBOperator,
    ...parcelQLComparisonOperators,
    ...parcelQLCollectionComparisonOperators,
    ...parcelQLJSONBComparisonOperators,
    ...parcelQLSubqueryExpressionOperator
]);
export { parcelQLOperators };

export type ParcelQLFunctions = typeof parcelQLJSONBFunctions[number]
    | typeof parcelQLDateTimeFunctions[number];