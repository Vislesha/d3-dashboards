/**
 * Widget state interface
 * Tracks the internal state of a widget (loading, error, data availability)
 */
export interface IWidgetState {
  /** Indicates if widget is currently loading data or component */
  loading: boolean;
  /** Error message if widget failed to load or encountered an error */
  error: string | null;
  /** Widget data (loaded from data source or passed directly) */
  data: any | null;
  /** Indicates if the dynamic component has been successfully loaded */
  componentLoaded: boolean;
  /** Timestamp of last successful data update */
  lastUpdated: Date | null;
}

