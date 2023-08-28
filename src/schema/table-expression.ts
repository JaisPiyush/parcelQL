/**
 * FROM clause of the query.
 * 
 * - FROM table_reference;
 * - T1 join_type T2 [ join_condition ]
    - A temporary name can be given to tables and complex table references to be used for references to the derived table in the rest of the query. This is called a table alias.
    FROM table_reference AS alias
    - Subqueries specifying a derived table must be enclosed in parentheses and must be assigned a table alias name 
    FROM (SELECT * FROM table1) AS alias_name
 */

import { ParcelQLBaseQuery } from './base-query-expression';
import { ParcelQLFilter } from './filter-expression';

export interface ParcelQLFrom<
    T = string | ParcelQLBaseQuery<'subquery', string>
> {
    table: T;
    alias: T extends string ? string | undefined : string;
    join?: ParcelQLJoin;
}

/**
 * Join clause of the query.
 * join_type T2 [ join_condition ]
 *  - Qualified joins
 *   T1 { [INNER] | { LEFT | RIGHT | FULL } [OUTER] } JOIN T2 ON boolean_expression
 *   T1 NATURAL { [INNER] | { LEFT | RIGHT | FULL } [OUTER] } JOIN T2
 */

export const parcelQLJoinTypes = [
    'inner',
    'left',
    'right',
    'full',
    'left outer',
    'right outer',
    'full outer',
    'natural inner',
    'natural left',
    'natural right',
    'natural full',
    'natural left outer',
    'natural right outer',
    'natural full outer'
] as const;

export type ParcelQLJoinType = (typeof parcelQLJoinTypes)[number];
export interface ParcelQLJoin {
    type: ParcelQLJoinType;
    table: string;
    alias?: string;
    on?: ParcelQLFilter;
}
