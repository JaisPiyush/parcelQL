/**
 * This file is used to define the schema of the ParcelQL.
 */

export interface ParcelQLColumn {}

export type ParcelQLGroupBySingle = Omit<ParcelQLColumn, 'alias'>;

export const queryActions = ['query', 'subquery', 'cte'] as const;
export type QueryAction = (typeof queryActions)[number];
