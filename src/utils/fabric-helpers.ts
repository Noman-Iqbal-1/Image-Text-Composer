import * as fabric from 'fabric';
import type { FabricObject } from '@/contexts/EditorContext';

interface ShapeOptions {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  [key: string]: unknown;
}

export const createRectangle = (options: ShapeOptions = {}): fabric.Rect | null => {
  try {
    return new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      ...options
    });
  } catch (error) {
    console.error('Error creating rectangle:', error);
    return null;
  }
};

export const createCircle = (options: ShapeOptions = {}): fabric.Circle | null => {
  try {
    return new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#10b981',
      stroke: '#047857',
      strokeWidth: 2,
      ...options
    });
  } catch (error) {
    console.error('Error creating circle:', error);
    return null;
  }
};

export const createText = (text = 'Click to edit', options: ShapeOptions = {}): fabric.IText | null => {
  try {
    return new fabric.IText(text, {
      left: 100,
      top: 100,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      ...options
    });
  } catch (error) {
    console.error('Error creating text:', error);
    return null;
  }
};

export const toFabricObject = (obj: fabric.FabricObject): FabricObject => {
  return obj as unknown as FabricObject;
};

export const isFabricLoaded = (): boolean => {
  return !!(
    fabric &&
    fabric.Canvas &&
    fabric.Rect &&
    fabric.Circle &&
    fabric.IText
  );
};

export const logFabricObjects = (): void => {
  if (!fabric) {
    console.error('Fabric is not loaded');
    return;
  }

  const fabricStatus = {
    Canvas: 'Canvas' in fabric,
    Rect: 'Rect' in fabric,
    Circle: 'Circle' in fabric,
    IText: 'IText' in fabric,
    Text: 'Text' in fabric,
    Textbox: 'Textbox' in fabric,
    FabricImage: 'FabricImage' in fabric,
    filters: 'filters' in fabric,
  };

  console.log('Fabric.js Status:', fabricStatus);
  console.log('Fabric version:', (fabric as { version?: string }).version || 'unknown');
};

export const applyImageFilters = (
  image: fabric.FabricImage,
  filters: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
  }
): void => {
  const imageFilters: fabric.filters.BaseFilter<string, Record<string, unknown>, Record<string, unknown>>[] = [];

  if (filters.brightness !== undefined && filters.brightness !== 0) {
    imageFilters.push(new fabric.filters.Brightness({
      brightness: filters.brightness / 100
    }));
  }

  if (filters.contrast !== undefined && filters.contrast !== 0) {
    imageFilters.push(new fabric.filters.Contrast({
      contrast: filters.contrast / 100
    }));
  }

  if (filters.saturation !== undefined && filters.saturation !== 0) {
    imageFilters.push(new fabric.filters.Saturation({
      saturation: filters.saturation / 100
    }));
  }

  if (filters.blur !== undefined && filters.blur > 0) {
    imageFilters.push(new fabric.filters.Blur({
      blur: filters.blur / 100
    }));
  }

  image.filters = imageFilters;
  image.applyFilters();
};