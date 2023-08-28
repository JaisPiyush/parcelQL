export const queryActions = ['query', 'subquery', 'cte'] as const;
export type QueryAction = (typeof queryActions)[number];

export interface ParcelQLBaseQuery<Q = QueryAction, F = any> {
    action: Q;
    table: F;
}

//TODO: add support for cte
// TODO: add support for frame_clause
