import { ColorPaletteManager } from './color-palette';
import { IColorPalette } from '../entities/chart.interface';
import { PaletteNotFoundError, InvalidColorPaletteError } from '../services/chart.service.types';

describe('ColorPaletteManager', () => {
  let manager: ColorPaletteManager;

  beforeEach(() => {
    manager = new ColorPaletteManager();
  });

  describe('getColorPalette', () => {
    it('should return existing palette', () => {
      const palette: IColorPalette = {
        name: 'test-palette',
        colors: [
          '#ff0000',
          '#00ff00',
          '#0000ff',
          '#ffff00',
          '#ff00ff',
          '#00ffff',
          '#ffffff',
          '#000000',
          '#808080',
          '#ff8080',
        ],
      };

      manager.setColorPalette(palette);
      const result = manager.getColorPalette('test-palette');

      expect(result).toBeDefined();
      expect(result?.name).toBe('test-palette');
      expect(result?.colors).toHaveLength(10);
    });

    it('should return null for non-existent palette', () => {
      const result = manager.getColorPalette('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('setColorPalette', () => {
    it('should register valid palette', () => {
      const palette: IColorPalette = {
        name: 'valid-palette',
        colors: [
          '#ff0000',
          '#00ff00',
          '#0000ff',
          '#ffff00',
          '#ff00ff',
          '#00ffff',
          '#ffffff',
          '#000000',
          '#808080',
          '#ff8080',
        ],
      };

      expect(() => manager.setColorPalette(palette)).not.toThrow();
      expect(manager.getColorPalette('valid-palette')).toBeDefined();
    });

    it('should overwrite existing palette with same name silently', () => {
      const palette1: IColorPalette = {
        name: 'overwrite-palette',
        colors: Array(10).fill('#ff0000'),
      };

      const palette2: IColorPalette = {
        name: 'overwrite-palette',
        colors: Array(10).fill('#00ff00'),
      };

      manager.setColorPalette(palette1);
      manager.setColorPalette(palette2);

      const result = manager.getColorPalette('overwrite-palette');
      expect(result?.colors[0]).toBe('#00ff00'); // Should have new colors
    });

    it('should throw InvalidColorPaletteError for palette with less than 10 colors', () => {
      const palette: IColorPalette = {
        name: 'invalid-palette',
        colors: ['#ff0000', '#00ff00', '#0000ff'], // Only 3 colors
      };

      expect(() => manager.setColorPalette(palette)).toThrow(InvalidColorPaletteError);
    });
  });

  describe('setDefaultPalette', () => {
    it('should set default palette by name', () => {
      const palette: IColorPalette = {
        name: 'default-test',
        colors: Array(10).fill('#ff0000'),
      };

      manager.setColorPalette(palette);
      manager.setDefaultPalette('default-test');

      expect(manager.getDefaultPaletteName()).toBe('default-test');
    });

    it('should throw PaletteNotFoundError if palette not found', () => {
      expect(() => manager.setDefaultPalette('non-existent')).toThrow(PaletteNotFoundError);
    });
  });

  describe('getColors', () => {
    it('should return colors from default palette', () => {
      const palette: IColorPalette = {
        name: 'default-colors',
        colors: [
          '#ff0000',
          '#00ff00',
          '#0000ff',
          '#ffff00',
          '#ff00ff',
          '#00ffff',
          '#ffffff',
          '#000000',
          '#808080',
          '#ff8080',
        ],
      };

      manager.setColorPalette(palette);
      manager.setDefaultPalette('default-colors');

      const colors = manager.getColors(5);

      expect(colors).toHaveLength(5);
      expect(colors[0]).toBe('#ff0000');
      expect(colors[4]).toBe('#ff00ff');
    });

    it('should return colors from specific palette', () => {
      const palette: IColorPalette = {
        name: 'specific-palette',
        colors: [
          '#ff0000',
          '#00ff00',
          '#0000ff',
          '#ffff00',
          '#ff00ff',
          '#00ffff',
          '#ffffff',
          '#000000',
          '#808080',
          '#ff8080',
        ],
      };

      manager.setColorPalette(palette);

      const colors = manager.getColors(3, 'specific-palette');

      expect(colors).toHaveLength(3);
      expect(colors[0]).toBe('#ff0000');
      expect(colors[2]).toBe('#0000ff');
    });

    it('should cycle colors when count is greater than palette size', () => {
      const palette: IColorPalette = {
        name: 'cycle-palette',
        colors: [
          '#ff0000',
          '#00ff00',
          '#0000ff',
          '#ffff00',
          '#ff00ff',
          '#00ffff',
          '#ffffff',
          '#000000',
          '#808080',
          '#ff8080',
        ],
      };

      manager.setColorPalette(palette);

      const colors = manager.getColors(15, 'cycle-palette'); // Request 15, palette has 10

      expect(colors).toHaveLength(15);
      expect(colors[0]).toBe('#ff0000'); // First color
      expect(colors[9]).toBe('#ff8080'); // Last color
      expect(colors[10]).toBe('#ff0000'); // Cycles back to first
      expect(colors[14]).toBe('#ff00ff'); // Cycles to 5th color
    });
  });

  describe('default palette registration', () => {
    it('should have default palettes registered on initialization', () => {
      const defaultPalette = manager.getColorPalette('default');

      expect(defaultPalette).toBeDefined();
      expect(defaultPalette?.colors.length).toBeGreaterThanOrEqual(10);
    });
  });
});
