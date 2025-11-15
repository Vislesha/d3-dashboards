import { createScale, updateScale } from './scale-helpers';
import { IScaleConfig } from '../entities/chart.interface';
import { InvalidScaleConfigError } from '../services/chart.service.types';

describe('Scale Helpers', () => {
  describe('createScale', () => {
    it('should create a linear scale', () => {
      const config: IScaleConfig = {
        type: 'linear',
        domain: [0, 100],
        range: [0, 800]
      };

      const scale = createScale(config);

      expect(scale).toBeDefined();
      expect(scale(0)).toBe(0);
      expect(scale(100)).toBe(800);
      expect(scale(50)).toBe(400);
    });

    it('should create a time scale', () => {
      const config: IScaleConfig = {
        type: 'time',
        domain: [new Date(2020, 0, 1), new Date(2020, 11, 31)],
        range: [0, 800]
      };

      const scale = createScale(config);

      expect(scale).toBeDefined();
      expect(typeof scale(new Date(2020, 5, 15))).toBe('number');
    });

    it('should create an ordinal scale', () => {
      const config: IScaleConfig = {
        type: 'ordinal',
        domain: ['A', 'B', 'C'],
        range: [0, 100, 200] as number[]
      };

      const scale = createScale(config);

      expect(scale).toBeDefined();
      expect(scale('A')).toBe(0);
      expect(scale('B')).toBe(100);
      expect(scale('C')).toBe(200);
    });

    it('should create a band scale', () => {
      const config: IScaleConfig = {
        type: 'band',
        domain: ['A', 'B', 'C'],
        range: [0, 800],
        padding: 0.1
      };

      const scale = createScale(config);

      expect(scale).toBeDefined();
      expect(typeof scale('A')).toBe('number');
      expect(scale.bandwidth).toBeDefined();
    });

    it('should create a log scale', () => {
      const config: IScaleConfig = {
        type: 'log',
        domain: [1, 100],
        range: [0, 800]
      };

      const scale = createScale(config);

      expect(scale).toBeDefined();
      expect(typeof scale(10)).toBe('number');
    });

    it('should create a pow scale', () => {
      const config: IScaleConfig = {
        type: 'pow',
        domain: [0, 100],
        range: [0, 800]
      };

      const scale = createScale(config);

      expect(scale).toBeDefined();
      expect(typeof scale(50)).toBe('number');
    });

    it('should create a sqrt scale', () => {
      const config: IScaleConfig = {
        type: 'sqrt',
        domain: [0, 100],
        range: [0, 800]
      };

      const scale = createScale(config);

      expect(scale).toBeDefined();
      expect(typeof scale(50)).toBe('number');
    });

    it('should throw InvalidScaleConfigError for invalid config', () => {
      const config: IScaleConfig = {
        type: 'invalid' as any,
        domain: [0, 100] as [number, number],
        range: [0, 800] as [number, number]
      };

      expect(() => createScale(config)).toThrow(InvalidScaleConfigError);
    });
  });

  describe('updateScale', () => {
    it('should create a new scale with updated configuration (immutable update)', () => {
      const originalConfig: IScaleConfig = {
        type: 'linear',
        domain: [0, 100] as [number, number],
        range: [0, 800] as [number, number]
      };

      const originalScale = createScale(originalConfig);
      const originalValue = originalScale(50);

      const updates: Partial<IScaleConfig> = {
        type: 'linear', // Required for update
        domain: [0, 200] as [number, number],
        range: [0, 800] as [number, number]
      };

      const updatedScale = updateScale(originalScale, updates);

      expect(updatedScale).toBeDefined();
      expect(updatedScale).not.toBe(originalScale); // New instance
      expect(updatedScale(100)).not.toBe(originalScale(100)); // Different mapping
    });
  });
});

