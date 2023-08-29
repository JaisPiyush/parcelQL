/**
 * Create Aggregate expressions for the query.
 *  - aggregate_name (expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
 *  - aggregate_name (ALL expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
 *  - aggregate_name (DISTINCT expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
 *  - aggregate_name ( * ) [ FILTER ( WHERE filter_clause ) ]
 *  - aggregate_name ( [ expression [ , ... ] ] ) WITHIN GROUP ( order_by_clause ) [ FILTER ( WHERE filter_clause ) ]
 */

import { ParcelQLGroupBySingle } from '../../schemas';
import { ParcelQLExpression } from './base-column-expression';
import { ParcelQLFilter } from '../filter-expression';

export interface ParcelQLAggregateExpression extends ParcelQLExpression {}

export const parcelQLAggregateNames = [
    'avg',
    'count',
    'max',
    'min',
    'sum',
    'mode'
] as const;

export const parcelQLAggregateNamesWithGroup = [
    'percentile_cont',
    'percentile_disc',
    'rank',
    'dense_rank',
    'percent_rank',
    'cume_dist'
] as const;

export type ParcelQLAggregateName =
    | (typeof parcelQLAggregateNames)[number]
    | (typeof parcelQLAggregateNamesWithGroup)[number];

export interface ParcelQLAggregate {
    filter?: ParcelQLFilter;
    name: ParcelQLAggregateName;
    parameters:
        | ParcelQLAggregateExpression
        | ParcelQLAggregateExpression[]
        | unknown;
    group?: ParcelQLGroupBySingle | ParcelQLGroupBySingle[];
}
