/**
 * Zoom and pan helper utilities for D3 charts
 */

import * as d3 from 'd3';
import { Selection } from 'd3-selection';

/**
 * Configuration for zoom behavior creation
 */
export interface IZoomBehaviorConfig {
  /** Minimum zoom level (default: 1) */
  minZoom?: number;
  /** Maximum zoom level (default: 10) */
  maxZoom?: number;
  /** Whether to constrain translation to data bounds */
  constrainTranslation?: boolean;
  /** Data domain for x-axis (for constraining pan) */
  xDomain?: [number, number] | [Date, Date];
  /** Data domain for y-axis (for constraining pan) */
  yDomain?: [number, number];
  /** Chart width (for constraining pan) */
  width?: number;
  /** Chart height (for constraining pan) */
  height?: number;
}

/**
 * Creates a D3 zoom behavior with configured constraints
 * @param config Zoom behavior configuration
 * @returns Configured D3 zoom behavior
 */
export function createZoomBehavior(
  config: IZoomBehaviorConfig = {}
): d3.ZoomBehavior<Element, unknown> {
  const {
    minZoom = 1,
    maxZoom = 10,
    constrainTranslation = true,
    xDomain,
    yDomain,
    width,
    height,
  } = config;

  const zoom = d3.zoom<Element, unknown>().scaleExtent([minZoom, maxZoom]);

  if (constrainTranslation && xDomain && yDomain && width && height) {
    // Calculate translate extent based on data domain and chart dimensions
    // This prevents panning beyond the data bounds
    const xRange = xDomain[1] as number - (xDomain[0] as number);
    const yRange = yDomain[1] - yDomain[0];

    // Set translate extent to constrain panning
    zoom.translateExtent([
      [0, 0],
      [width, height],
    ]);
  }

  return zoom;
}

/**
 * Applies a zoom transform to a selection programmatically
 * @param selection D3 selection to apply zoom transform to
 * @param transform Zoom transform to apply
 * @param zoomBehavior Zoom behavior instance
 */
export function applyZoomTransform<T extends Element>(
  selection: Selection<T, unknown, null, undefined>,
  transform: d3.ZoomTransform,
  zoomBehavior: d3.ZoomBehavior<T, unknown>
): void {
  selection.call(zoomBehavior.transform, transform);
}

/**
 * Resets zoom to initial state (identity transform)
 * @param selection D3 selection to reset zoom on
 * @param zoomBehavior Zoom behavior instance
 */
export function resetZoomTransform<T extends Element>(
  selection: Selection<T, unknown, null, undefined>,
  zoomBehavior: d3.ZoomBehavior<T, unknown>
): void {
  const identity = d3.zoomIdentity;
  selection.call(zoomBehavior.transform, identity);
}

/**
 * Constrains zoom transform to data bounds
 * @param transform Current zoom transform
 * @param config Configuration with data domains and chart dimensions
 * @returns Constrained zoom transform
 */
export function constrainZoomBounds(
  transform: d3.ZoomTransform,
  config: IZoomBehaviorConfig
): d3.ZoomTransform {
  const { xDomain, yDomain, width, height, minZoom = 1, maxZoom = 10 } = config;

  if (!xDomain || !yDomain || !width || !height) {
    return transform;
  }

  // Constrain scale
  let k = transform.k;
  k = Math.max(minZoom, Math.min(maxZoom, k));

  // Constrain translation based on scaled domain
  const xRange = (xDomain[1] as number) - (xDomain[0] as number);
  const yRange = yDomain[1] - yDomain[0];

  // Calculate scaled dimensions
  const scaledWidth = width * k;
  const scaledHeight = height * k;

  // Constrain x translation
  let tx = transform.x;
  const maxTx = Math.max(0, scaledWidth - width);
  const minTx = Math.min(0, width - scaledWidth);
  tx = Math.max(minTx, Math.min(maxTx, tx));

  // Constrain y translation
  let ty = transform.y;
  const maxTy = Math.max(0, scaledHeight - height);
  const minTy = Math.min(0, height - scaledHeight);
  ty = Math.max(minTy, Math.min(maxTy, ty));

  return d3.zoomIdentity.translate(tx, ty).scale(k);
}

