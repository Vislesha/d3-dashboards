import { ID3WidgetConfig } from './widget.interface';

/**
 * Widget configuration change event interface
 * Represents configuration changes from the configuration panel
 */
export interface IWidgetConfigurationChangeEvent {
  /** ID of the widget being updated */
  widgetId: string;
  /** New configuration object */
  config: ID3WidgetConfig;
  /** Array of field names that were changed (for optimization) */
  changedFields: string[];
}

