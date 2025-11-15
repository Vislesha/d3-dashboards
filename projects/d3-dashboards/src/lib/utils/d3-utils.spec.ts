import { calculateMargins, calculateInnerDimensions, extent } from './d3-utils';
import { IMargins } from '../entities/chart.interface';

describe('D3 Utils', () => {
  describe('calculateMargins', () => {
    it('should calculate margins with default values', () => {
      const margins = calculateMargins(800, 400);

      expect(margins).toBeDefined();
      expect(margins.top).toBe(20);
      expect(margins.right).toBe(20);
      expect(margins.bottom).toBe(40);
      expect(margins.left).toBe(40);
    });

    it('should calculate margins with custom values', () => {
      const customMargins: Partial<IMargins> = {
        top: 30,
        left: 50,
      };

      const margins = calculateMargins(800, 400, customMargins);

      expect(margins.top).toBe(30);
      expect(margins.right).toBe(20); // Default
      expect(margins.bottom).toBe(40); // Default
      expect(margins.left).toBe(50);
    });
  });

  describe('calculateInnerDimensions', () => {
    it('should calculate inner dimensions correctly', () => {
      const margins: IMargins = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 40,
      };

      const dimensions = {
        width: 800,
        height: 400,
        margins,
      };

      const inner = calculateInnerDimensions(dimensions);

      expect(inner.width).toBe(800 - 40 - 20); // width - left - right = 740
      expect(inner.height).toBe(400 - 20 - 40); // height - top - bottom = 340
    });
  });

  describe('extent', () => {
    it('should calculate extent for numeric data', () => {
      const data = [{ value: 10 }, { value: 20 }, { value: 5 }, { value: 30 }];

      const [min, max] = extent(data, (d) => d.value);

      expect(min).toBe(5);
      expect(max).toBe(30);
    });

    it('should return [0, 0] for empty array', () => {
      const data: any[] = [];

      const [min, max] = extent(data, (d) => d.value);

      expect(min).toBe(0);
      expect(max).toBe(0);
    });
  });
});
