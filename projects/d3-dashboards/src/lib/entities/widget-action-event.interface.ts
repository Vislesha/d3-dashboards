/**
 * Widget action event interface
 * Represents user actions triggered from widget header
 */
export interface IWidgetActionEvent {
  /** Type of action */
  action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure';
  /** ID of the widget the action applies to */
  widgetId: string;
  /** Optional payload for action-specific data (e.g., export format) */
  payload?: any;
}

