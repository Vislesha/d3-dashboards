import { GridsterItem } from 'angular-gridster2';
import { IFilterValues } from './filter.interface';

/**
 * Widget configuration interface
 */
export interface ID3WidgetConfig {
  chartOptions?: any;
  tableOptions?: any;
  filterOptions?: any;
  tileOptions?: any;
  markdownOptions?: any;
  [key: string]: any;
}

/**
 * Data source interface
 */
export interface IDataSource {
  type: 'api' | 'static' | 'computed';
  endpoint?: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  data?: any[];
  transform?: (data: any) => any;
}

/**
 * Widget style interface
 */
export interface IWidgetStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
}

/**
 * D3 Widget interface
 */
export interface ID3Widget {
  /** Unique widget identifier (UUID) */
  id: string;
  /** Widget type */
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'treemap' | 'force-graph' | 'geo-map' | 'gauge' | 'table' | 'filter' | 'tile' | 'markdown';
  /** Widget position in grid */
  position: GridsterItem;
  /** Widget title */
  title: string;
  /** Widget configuration */
  config: ID3WidgetConfig;
  /** Optional data source */
  dataSource?: IDataSource;
  /** Optional filters */
  filters?: IFilterValues[];
  /** Optional styling */
  style?: IWidgetStyle;
}

