'use client';

import * as React from 'react';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HistoryState {
  json: string;
  timestamp: number;
}

export interface FabricCanvas {
  loadFromJSON: (json: string, callback: () => void) => void;
  requestRenderAll: () => void;
  renderAll: () => void;
  getObjects: () => FabricObject[];
  getActiveObject: () => FabricObject | null;
  remove: (object: FabricObject) => void;
  clear: () => void;
  toDataURL: (options?: {
    format?: string;
    quality?: number;
    multiplier?: number;
  }) => string;
  toBlob: (
    callback: (blob: Blob | null) => void,
    format?: string,
    quality?: number
  ) => void;
  getWidth: () => number;
  getHeight: () => number;
  isInternalUpdate?: boolean;
  set: (key: string, value: unknown) => void;
  add: (object: FabricObject) => void;
  setActiveObject: (object: FabricObject) => void;
  toJSON: () => Record<string, unknown>;
  isDrawingMode?: boolean;
  selection?: boolean;
  defaultCursor?: string;
  freeDrawingBrush?: {
    width: number;
    color: string;
  };
  setDimensions: (dimensions: { width: number; height: number }) => void;
  on: (event: string, handler: (e?: FabricEvent) => void) => void;
  dispose: () => void;
  bringForward: (object: FabricObject) => void;
  sendBackwards: (object: FabricObject) => void;
  getContext?: () => CanvasRenderingContext2D | null;
}

export interface FabricObject {
  type?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  scale?: (scale: number) => void;
  set?: (props: Record<string, unknown>) => void;
  filters?: unknown[];
  visible?: boolean;
  opacity?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fill?: string | null;
  textAlign?: string;
  lineHeight?: number;
  charSpacing?: number;
  underline?: boolean;
  stroke?: string | null;
  strokeWidth?: number;
  angle?: number;
  flipX?: boolean;
  flipY?: boolean;
}

export interface FabricEvent {
  selected?: FabricObject[];
  target?: FabricObject;
}

interface EditorContextType {
  canvas: FabricCanvas | null;
  setCanvas: (canvas: FabricCanvas | null) => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  selectedObject: FabricObject | null;
  setSelectedObject: (obj: FabricObject | null) => void;
  history: HistoryState[];
  historyIndex: number;
  addToHistory: (state: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  layers: FabricObject[];
  setLayers: (layers: FabricObject[]) => void;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
  };
  setFilters: (filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
  }) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [layers, setLayers] = useState<FabricObject[]>([]);
  const [filters, setFilters] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
  });

  const addToHistory = useCallback((state: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({
        json: state,
        timestamp: Date.now(),
      });
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && canvas) {
      const targetIndex = historyIndex - 1;
      const state = history[targetIndex];
      canvas.isInternalUpdate = true;
      
      canvas.loadFromJSON(state.json, () => {
        canvas.requestRenderAll();
        setHistoryIndex(targetIndex);
        const objects = canvas.getObjects();
        setLayers([...objects]);
        setTimeout(() => {
          canvas.isInternalUpdate = false;
        }, 200);
      });
    }
  }, [canvas, history, historyIndex, setLayers]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && canvas) {
      const targetIndex = historyIndex + 1;
      const state = history[targetIndex];
      canvas.isInternalUpdate = true;
      
      canvas.loadFromJSON(state.json, () => {
        canvas.requestRenderAll();
        setHistoryIndex(targetIndex);
        const objects = canvas.getObjects();
        setLayers([...objects]);
        setTimeout(() => {
          canvas.isInternalUpdate = false;
        }, 200);
      });
    }
  }, [canvas, history, historyIndex, setLayers]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <EditorContext.Provider
      value={{
        canvas,
        setCanvas,
        activeTool,
        setActiveTool,
        selectedObject,
        setSelectedObject,
        history,
        historyIndex,
        addToHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        imageFile,
        setImageFile,
        layers,
        setLayers,
        filters,
        setFilters,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};