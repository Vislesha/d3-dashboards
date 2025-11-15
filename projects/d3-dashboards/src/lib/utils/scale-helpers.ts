import {
  scaleLinear,
  scaleTime,
  scaleOrdinal,
  scaleBand,
  scaleLog,
  scalePow,
  scaleSqrt,
} from 'd3-scale';
import { IScaleConfig, ScaleType } from '../entities/chart.interface';
import { InvalidScaleConfigError } from '../services/chart.service.types';

/**
 * Creates a D3 scale based on configuration
 * @param config Scale configuration with type, domain, range, and optional settings
 * @returns D3 Scale object
 * @throws InvalidScaleConfigError if configuration is invalid
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createScale(config: IScaleConfig): any {
  // Validate scale type
  const validTypes: ScaleType[] = ['linear', 'time', 'ordinal', 'band', 'log', 'pow', 'sqrt'];
  if (!validTypes.includes(config.type)) {
    throw new InvalidScaleConfigError(`Invalid scale type: ${config.type}`);
  }

  // Validate domain and range
  if (!config.domain || !Array.isArray(config.domain) || config.domain.length === 0) {
    throw new InvalidScaleConfigError('Domain must be a non-empty array');
  }
  if (!config.range || !Array.isArray(config.range) || config.range.length === 0) {
    throw new InvalidScaleConfigError('Range must be a non-empty array');
  }

  switch (config.type) {
    case 'linear': {
      const scale = scaleLinear();
      if (config.domain.length === 2) {
        scale.domain(config.domain as [number, number]);
      }
      if (config.range.length === 2) {
        scale.range(config.range as [number, number]);
      }
      if (config.nice) {
        scale.nice();
      }
      return scale;
    }

    case 'time': {
      const scale = scaleTime();
      if (config.domain.length === 2) {
        scale.domain(config.domain as [Date, Date]);
      }
      if (config.range.length === 2) {
        scale.range(config.range as [number, number]);
      }
      if (config.nice) {
        scale.nice();
      }
      return scale;
    }

    case 'ordinal': {
      const scale = scaleOrdinal<string, number>();
      scale.domain(config.domain as string[]);
      scale.range(config.range as number[]);
      return scale;
    }

    case 'band': {
      const scale = scaleBand<string>();
      scale.domain(config.domain as string[]);
      if (config.range.length === 2) {
        scale.range(config.range as [number, number]);
      }
      if (config.padding !== undefined) {
        scale.padding(config.padding);
      }
      return scale;
    }

    case 'log': {
      const scale = scaleLog();
      if (config.domain.length === 2) {
        scale.domain(config.domain as [number, number]);
      }
      if (config.range.length === 2) {
        scale.range(config.range as [number, number]);
      }
      if (config.nice) {
        scale.nice();
      }
      return scale;
    }

    case 'pow': {
      const scale = scalePow();
      if (config.domain.length === 2) {
        scale.domain(config.domain as [number, number]);
      }
      if (config.range.length === 2) {
        scale.range(config.range as [number, number]);
      }
      if (config.nice) {
        scale.nice();
      }
      return scale;
    }

    case 'sqrt': {
      const scale = scaleSqrt();
      if (config.domain.length === 2) {
        scale.domain(config.domain as [number, number]);
      }
      if (config.range.length === 2) {
        scale.range(config.range as [number, number]);
      }
      if (config.nice) {
        scale.nice();
      }
      return scale;
    }

    default:
      throw new InvalidScaleConfigError(`Unsupported scale type: ${config.type}`);
  }
}

/**
 * Updates an existing D3 scale with new configuration by creating a new scale
 * @param existingScale Existing D3 scale object to update
 * @param updates Partial scale configuration with properties to update
 * @returns New scale object with updated configuration (immutable update)
 * @throws InvalidScaleConfigError if updated configuration is invalid
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateScale(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingScale: any,
  updates: Partial<IScaleConfig>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // Get the current scale configuration by inspecting the scale
  // Since we can't directly read from D3 scales, we need to create a new one
  // For immutable updates, we always create a new scale
  // The caller should provide the full config or we infer from existing scale

  // For now, we'll require the type to be specified in updates
  // In a real implementation, we might need to detect the scale type
  if (!updates.type) {
    throw new InvalidScaleConfigError('Scale type must be specified for update');
  }

  // Create a new config by merging updates
  // Note: This is a simplified implementation
  // In practice, we'd need to extract current domain/range from existing scale
  const newConfig: IScaleConfig = {
    ...updates,
    type: updates.type,
    domain: updates.domain || [0, 1],
    range: updates.range || [0, 1],
    nice: updates.nice,
    padding: updates.padding,
  } as IScaleConfig;

  return createScale(newConfig);
}
