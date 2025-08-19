'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditor, type FabricCanvas, type FabricObject } from '@/contexts/EditorContext';

interface ExtendedCanvas extends fabric.Canvas {
  isInternalUpdate?: boolean;
}

if (typeof window !== 'undefined') {
  (window as Window & { fabric?: typeof fabric }).fabric = fabric;
}

interface CanvasProps {
  imageUrl?: string;
}

export const Canvas: React.FC<CanvasProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<ExtendedCanvas | null>(null);
  const { 
    setCanvas, 
    addToHistory, 
    setSelectedObject,
    activeTool,
    setLayers
  } = useEditor();
  
  const addToHistoryRef = useRef(addToHistory);
  useEffect(() => {
    addToHistoryRef.current = addToHistory;
  }, [addToHistory]);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    
    const container = containerRef.current;
    if (!container) return;
    
    const { width, height } = container.getBoundingClientRect();
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: '#f3f4f6',
      preserveObjectStacking: true,
    }) as ExtendedCanvas;
    
    fabricRef.current = canvas;
    
    canvas.isInternalUpdate = false;
    
    const handleResize = () => {
      if (container && canvas) {
        const { width, height } = container.getBoundingClientRect();
        canvas.setDimensions({
          width: width,
          height: height,
        });
        canvas.requestRenderAll();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0] && !canvas.isInternalUpdate) {
        setSelectedObject(e.selected[0] as FabricObject);
      }
    });

    canvas.on('selection:updated', (e) => {
      if (e.selected && e.selected[0] && !canvas.isInternalUpdate) {
        setSelectedObject(e.selected[0] as FabricObject);
      }
    });

    canvas.on('selection:cleared', () => {
      if (!canvas.isInternalUpdate) {
        setSelectedObject(null);
      }
    });
    
    canvas.on('object:modified', () => {
      if (!canvas.isInternalUpdate) {
        const json = JSON.stringify(canvas.toJSON());
        addToHistoryRef.current(json);
        updateLayers();
      }
    });

    canvas.on('object:added', () => {
      if (!canvas.isInternalUpdate) {
        updateLayers();
      }
    });

    canvas.on('object:removed', () => {
      if (!canvas.isInternalUpdate) {
        updateLayers();
        setTimeout(() => {
          const json = JSON.stringify(canvas.toJSON());
          addToHistoryRef.current(json);
        }, 100);
      }
    });
    
    const updateLayers = () => {
      const objects = canvas.getObjects();
      setLayers([...objects] as FabricObject[]);
    };
    
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = '#000000';
    
    setCanvas(canvas as unknown as FabricCanvas);
    
    setTimeout(() => {
      const initialState = JSON.stringify(canvas.toJSON());
      addToHistoryRef.current(initialState);
    }, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !imageUrl) return;
    
    console.log('Loading image...');
    
    const objects = canvas.getObjects();
    const hasImage = objects.some(obj => obj.type === 'image' || obj.type === 'Image');
    
    if (hasImage) {
      console.log('Image already exists, skipping load');
      return;
    }
    
    fabric.FabricImage.fromURL(imageUrl).then((img) => {
      if (!fabricRef.current) return;
      
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const scale = Math.min(
        canvasWidth / (img.width || 1),
        canvasHeight / (img.height || 1)
      ) * 0.9;
      
      img.scale(scale);
      img.set({
        left: (canvasWidth - (img.width || 0) * scale) / 2,
        top: (canvasHeight - (img.height || 0) * scale) / 2,
      });
      
      img.type = 'Image';
      if (!img.filters) {
        img.filters = [];
      }
      
      canvas.isInternalUpdate = true;
      canvas.clear();
      canvas.set('backgroundColor', '#f3f4f6');
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
      
      setTimeout(() => {
        canvas.isInternalUpdate = false;
        const state = JSON.stringify(canvas.toJSON());
        addToHistoryRef.current(state);
      }, 100);
    }).catch((err) => {
      console.error('Failed to load image:', err);
    });
  }, [imageUrl]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    canvas.isDrawingMode = false;
    canvas.selection = true;
    
    switch (activeTool) {
      case 'select':
        canvas.defaultCursor = 'default';
        break;
      case 'draw':
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = 2;
          canvas.freeDrawingBrush.color = '#000000';
        }
        break;
      case 'text':
        canvas.defaultCursor = 'text';
        break;
      case 'shapes':
        canvas.defaultCursor = 'crosshair';
        break;
      default:
        canvas.defaultCursor = 'default';
    }
  }, [activeTool]);

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};