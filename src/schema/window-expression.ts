import { ParcelQLExpression } from './column-expression';
import { ParcelQLFilter } from './filter-expression';

/**
 * Create Window function expression for the query
 * function_name ([expression [, expression ... ]]) [ FILTER ( WHERE filter_clause ) ] OVER window_name
 * function_name ([expression [, expression ... ]]) [ FILTER ( WHERE filter_clause ) ] OVER ( window_definition )
 * function_name ( * ) [ FILTER ( WHERE filter_clause ) ] OVER window_name
 * function_name ( * ) [ FILTER ( WHERE filter_clause ) ] OVER ( window_definition )
 *
 */

export interface ParcelQLWindowExpression extends ParcelQLExpression {}

export const parcelQLWindowNames = [
    'row_number',
    'rank',
    'dense_rank',
    'percent_rank',
    'cume_dist',
    'ntile',
    'lag',
    'lead',
    'first_value',
    'last_value',
    'nth_value'
] as const;

export type ParcelQLWindowNames = (typeof parcelQLWindowNames)[number];

export type ParcelQLWindowDefinition =
    | ParcelQLWindowExpression
    | {
          partitionBy?: ParcelQLWindowExpression[];
      }
    | {
          orderBy?: ParcelQLWindowDefinitionOrderByExpression[];
      }
    | {
          partitionBy?: ParcelQLWindowExpression[];
          orderBy?: ParcelQLWindowDefinitionOrderByExpression[];
      };

export type ParcelQLWindowDefinitionOrderByExpression =
    ParcelQLWindowExpression & {
        nulls?: 'first' | 'last';
    };

export interface ParcelQLWindow {
    name: ParcelQLWindowNames;
    expression: ParcelQLWindowExpression | ParcelQLWindowExpression[];
    filter?: ParcelQLFilter;
    window: ParcelQLWindowDefinition;
}
