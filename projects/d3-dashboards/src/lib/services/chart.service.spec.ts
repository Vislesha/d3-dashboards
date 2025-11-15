import { TestBed } from '@angular/core/testing';
import { ChartService } from './chart.service';
import {
  IChartConfig,
  IChartInstance,
  ChartType,
  IScaleConfig,
  IAxisConfig,
} from '../entities/chart.interface';
import { InvalidChartTypeError, InvalidChartConfigError } from './chart.service.types';

describe('ChartService', () => {
  let service: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartService],
    });
    service = TestBed.inject(ChartService);
  });

  describe('User Story 1 - Create Chart Instances', () => {
    describe('createChart', () => {
      it('should create a chart instance with valid line chart config', () => {
        const config: IChartConfig = {
          type: 'line',
          data: [
            { x: 1, y: 10 },
            { x: 2, y: 20 },
          ],
          options: {
            width: 800,
            height: 400,
            margin: { top: 20, right: 20, bottom: 40, left: 40 },
          },
        };

        const chart = service.createChart(config);

        expect(chart).toBeDefined();
        expect(chart.type).toBe('line');
        expect(chart.render).toBeDefined();
        expect(chart.update).toBeDefined();
        expect(chart.destroy).toBeDefined();
        expect(chart.getConfig).toBeDefined();
        expect(typeof chart.render).toBe('function');
        expect(typeof chart.update).toBe('function');
        expect(typeof chart.destroy).toBe('function');
        expect(typeof chart.getConfig).toBe('function');
      });

      it('should create a chart instance with valid bar chart config', () => {
        const config: IChartConfig = {
          type: 'bar',
          data: [
            { category: 'A', value: 10 },
            { category: 'B', value: 20 },
          ],
          options: {
            width: 800,
            height: 400,
          },
        };

        const chart = service.createChart(config);

        expect(chart).toBeDefined();
        expect(chart.type).toBe('bar');
        expect(chart.render).toBeDefined();
        expect(chart.update).toBeDefined();
        expect(chart.destroy).toBeDefined();
        expect(chart.getConfig).toBeDefined();
      });

      it('should throw InvalidChartTypeError when chart type is invalid', () => {
        const config = {
          type: 'invalid-type' as ChartType,
          data: [],
        };

        expect(() => service.createChart(config)).toThrow(InvalidChartTypeError);
        expect(() => service.createChart(config)).toThrow('Invalid chart type: invalid-type');
      });

      it('should throw InvalidChartConfigError when chart config is invalid', () => {
        const config = {
          type: 'line' as ChartType,
          // Missing required data or invalid structure
          options: {
            width: -100, // Invalid negative width
            height: 400,
          },
        };

        expect(() => service.createChart(config)).toThrow(InvalidChartConfigError);
      });
    });

    describe('validateChartConfig', () => {
      it('should return valid result for valid chart config', () => {
        const config: IChartConfig = {
          type: 'line',
          data: [{ x: 1, y: 10 }],
          options: {
            width: 800,
            height: 400,
          },
        };

        const result = service.validateChartConfig(config);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return invalid result with errors for invalid chart config', () => {
        const config = {
          type: 'invalid-type' as ChartType,
          data: [],
        };

        const result = service.validateChartConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('validateScaleConfig', () => {
      it('should return valid result for valid scale config', () => {
        const config: IScaleConfig = {
          type: 'linear',
          domain: [0, 100] as [number, number],
          range: [0, 800] as [number, number],
        };

        const result = service.validateScaleConfig(config);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return invalid result with errors for invalid scale config', () => {
        const config: IScaleConfig = {
          type: 'invalid' as any,
          domain: [] as any,
          range: [0, 800] as [number, number],
        };

        const result = service.validateScaleConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('validateAxisConfig', () => {
      it('should return valid result for valid axis config', () => {
        const scaleConfig: IScaleConfig = {
          type: 'linear',
          domain: [0, 100] as [number, number],
          range: [0, 800] as [number, number],
        };
        const scale = service.createScale(scaleConfig);

        const axisConfig: IAxisConfig = {
          scale,
          orientation: 'bottom',
        };

        const result = service.validateAxisConfig(axisConfig);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return invalid result with errors for invalid axis config', () => {
        const config = {
          scale: null,
          orientation: 'invalid' as any,
        };

        const result = service.validateAxisConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });
});
