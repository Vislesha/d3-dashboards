import { Type } from '@angular/core';

/**
 * Widget component loader utility
 * Provides component registry and dynamic loading functionality for widget types
 */

// Component registry for eager-loaded components
// Placeholder entries for now - will be populated when chart components are implemented
const COMPONENT_REGISTRY = new Map<string, Type<any>>([
  // Line and bar charts will be added when implemented
  // ['line', LineChartComponent],
  // ['bar', BarChartComponent],
]);

// Lazy loading map for optional components
// Placeholder entries for now - will be populated when chart components are implemented
const LAZY_COMPONENT_MAP: Record<string, () => Promise<any>> = {
  // Optional chart components will be added when implemented
  // 'pie': () => import('../charts/pie-chart/pie-chart.component').then(m => m.PieChartComponent),
  // 'scatter': () => import('../charts/scatter-plot/scatter-plot.component').then(m => m.ScatterPlotComponent),
};

/**
 * Loads a widget component based on widget type
 * @param type Widget type string
 * @returns Promise resolving to the component Type
 * @throws Error if widget type is unknown or component fails to load
 */
export async function loadWidgetComponent(type: string): Promise<Type<any>> {
  // Check registry first (eager-loaded components)
  const component = COMPONENT_REGISTRY.get(type);
  if (component) {
    return component;
  }

  // Check lazy loading map (optional components)
  const loader = LAZY_COMPONENT_MAP[type];
  if (loader) {
    try {
      return await loader();
    } catch (error) {
      throw new Error(`Failed to load widget component: ${type}. ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Unknown widget type
  throw new Error(`Unknown widget type: ${type}`);
}

