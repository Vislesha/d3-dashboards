/**
 * Filter value interface for dashboard filtering
 */
export interface IFilterValues {
  /** Filter key/field name */
  key: string;
  /** Filter value */
  value: any;
  /** Optional filter operator */
  operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
}
