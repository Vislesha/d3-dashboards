import { createAxis, updateAxis } from './axis-helpers';
import { createScale } from './scale-helpers';
import { IAxisConfig, IScaleConfig } from '../entities/chart.interface';
import { InvalidAxisConfigError } from '../services/chart.service.types';

describe('Axis Helpers', () => {
  let testScale: any;

  beforeEach(() => {
    const scaleConfig: IScaleConfig = {
      type: 'linear',
      domain: [0, 100],
      range: [0, 800]
    };
    testScale = createScale(scaleConfig);
  });

  describe('createAxis', () => {
    it('should create an axis with bottom orientation', () => {
      const config: IAxisConfig = {
        scale: testScale,
        orientation: 'bottom'
      };

      const axis = createAxis(config);

      expect(axis).toBeDefined();
      expect(typeof axis).toBe('function');
    });

    it('should create an axis with top orientation', () => {
      const config: IAxisConfig = {
        scale: testScale,
        orientation: 'top'
      };

      const axis = createAxis(config);

      expect(axis).toBeDefined();
      expect(typeof axis).toBe('function');
    });

    it('should create an axis with left orientation', () => {
      const config: IAxisConfig = {
        scale: testScale,
        orientation: 'left'
      };

      const axis = createAxis(config);

      expect(axis).toBeDefined();
      expect(typeof axis).toBe('function');
    });

    it('should create an axis with right orientation', () => {
      const config: IAxisConfig = {
        scale: testScale,
        orientation: 'right'
      };

      const axis = createAxis(config);

      expect(axis).toBeDefined();
      expect(typeof axis).toBe('function');
    });

    it('should create an axis with tick configuration', () => {
      const config: IAxisConfig = {
        scale: testScale,
        orientation: 'bottom',
        ticks: 5,
        tickFormat: (d: any) => `${d}%`,
        tickSize: 6
      };

      const axis = createAxis(config);

      expect(axis).toBeDefined();
      expect(typeof axis).toBe('function');
    });

    it('should throw InvalidAxisConfigError for invalid config', () => {
      const config = {
        scale: null,
        orientation: 'bottom' as any
      };

      expect(() => createAxis(config as IAxisConfig)).toThrow(InvalidAxisConfigError);
    });
  });

  describe('updateAxis', () => {
    it('should update an axis with new configuration', () => {
      const originalConfig: IAxisConfig = {
        scale: testScale,
        orientation: 'bottom',
        ticks: 5
      };

      const originalAxis = createAxis(originalConfig);

      const updates: Partial<IAxisConfig> = {
        scale: testScale, // Required for update
        orientation: 'bottom', // Required for update
        ticks: 10,
        tickFormat: (d: any) => `${d}%`
      };

      const updatedAxis = updateAxis(originalAxis, updates);

      expect(updatedAxis).toBeDefined();
      expect(typeof updatedAxis).toBe('function');
    });
  });
});

