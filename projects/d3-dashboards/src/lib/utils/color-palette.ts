import { schemeCategory10 } from 'd3-scale-chromatic';
import { IColorPalette } from '../entities/chart.interface';
import { PaletteNotFoundError, InvalidColorPaletteError } from '../services/chart.service.types';

/**
 * Color Palette Manager
 *
 * Manages color palettes for visual consistency across charts.
 * Provides palette registration, retrieval, and color cycling functionality.
 */
export class ColorPaletteManager {
  /**
   * Palette registry - maps palette names to palette objects
   */
  private readonly paletteRegistry: Map<string, IColorPalette>;

  /**
   * Default palette name
   */
  private defaultPaletteName: string;

  /**
   * Creates a new instance of ColorPaletteManager
   */
  constructor() {
    this.paletteRegistry = new Map<string, IColorPalette>();
    this.defaultPaletteName = 'default';

    // Register default palettes
    this.registerDefaultPalettes();
  }

  /**
   * Registers default color palettes using D3 categorical color schemes
   */
  private registerDefaultPalettes(): void {
    // Register D3 category10 as default palette
    // Convert readonly array to mutable array
    const defaultPalette: IColorPalette = {
      name: 'default',
      colors: [...schemeCategory10],
      description: 'D3 category10 color scheme',
    };

    this.paletteRegistry.set('default', defaultPalette);
    this.defaultPaletteName = 'default';
  }

  /**
   * Retrieves a color palette by name from the registry
   * @param name Name of the color palette to retrieve
   * @returns Color palette object if found, null if not found
   */
  getColorPalette(name: string): IColorPalette | null {
    return this.paletteRegistry.get(name) || null;
  }

  /**
   * Registers a color palette in the registry. If palette already exists, overwrites it silently.
   * @param palette Color palette object with name and colors array
   * @throws InvalidColorPaletteError if palette is invalid (e.g., less than 10 colors)
   */
  setColorPalette(palette: IColorPalette): void {
    // Validate palette
    if (!palette.name || palette.name.trim() === '') {
      throw new InvalidColorPaletteError('Palette name is required');
    }

    if (!palette.colors || !Array.isArray(palette.colors)) {
      throw new InvalidColorPaletteError('Palette colors must be an array');
    }

    if (palette.colors.length < 10) {
      throw new InvalidColorPaletteError(
        `Palette must have at least 10 colors, got ${palette.colors.length}`,
      );
    }

    // Validate all colors are strings
    for (const color of palette.colors) {
      if (typeof color !== 'string' || color.trim() === '') {
        throw new InvalidColorPaletteError('All colors must be non-empty strings');
      }
    }

    // Register palette (overwrites existing if present)
    this.paletteRegistry.set(palette.name, palette);
  }

  /**
   * Sets the default color palette by name
   * @param name Name of the palette to set as default
   * @throws PaletteNotFoundError if palette not found
   */
  setDefaultPalette(name: string): void {
    const palette = this.getColorPalette(name);
    if (!palette) {
      throw new PaletteNotFoundError(name);
    }

    this.defaultPaletteName = name;
  }

  /**
   * Gets the default palette name
   * @returns Default palette name
   */
  getDefaultPaletteName(): string {
    return this.defaultPaletteName;
  }

  /**
   * Retrieves the requested number of colors from a palette, cycling if needed
   * @param count Number of colors to retrieve
   * @param paletteName Optional name of palette to use. If not provided, uses default palette.
   * @returns Array of color strings (length = count)
   * @throws PaletteNotFoundError if palette not found
   */
  getColors(count: number, paletteName?: string): string[] {
    const name = paletteName || this.defaultPaletteName;
    const palette = this.getColorPalette(name);

    if (!palette) {
      throw new PaletteNotFoundError(name);
    }

    // Validate count
    if (count < 0) {
      throw new InvalidColorPaletteError(`Count must be non-negative, got ${count}`);
    }

    // If count is 0, return empty array
    if (count === 0) {
      return [];
    }

    // Cycle colors if count exceeds palette size
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(palette.colors[i % palette.colors.length]);
    }

    return colors;
  }
}
