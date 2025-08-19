'use client';

import * as React from 'react';
import { useCallback } from 'react';
import {
  MousePointer,
  Square,
  Circle,
  Type,
  Pencil,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo,
  Redo,
  Trash2,
  Download,
  Palette,
  Layers,
  Settings2,
} from 'lucide-react';
import { useEditor, type FabricCanvas, type FabricObject } from '@/contexts/EditorContext';
import * as fabric from 'fabric';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  active = false,
  disabled = false 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={label}
    className={`
      p-2 rounded-lg transition-all duration-200
      ${active 
        ? 'bg-blue-500 text-white' 
        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      }
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
      }
    `}
  >
    {icon}
  </button>
);

interface ToolbarProps {
  onOpenFilters: () => void;
  onOpenLayers: () => void;
  onOpenTextStyle?: () => void;
  onExport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onOpenFilters, 
  onOpenLayers,
  onOpenTextStyle,
  onExport 
}) => {
  const { 
    canvas, 
    activeTool, 
    setActiveTool, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    selectedObject,
    addToHistory
  } = useEditor();

  const handleDelete = useCallback(() => {
    if (canvas && canvas.getContext && selectedObject) {
      canvas.remove(selectedObject);
      canvas.requestRenderAll();
    }
  }, [canvas, selectedObject]);

  const handleRotate = useCallback(() => {
    if (canvas && canvas.getContext && selectedObject && selectedObject.set) {
      const currentAngle = selectedObject.angle || 0;
      selectedObject.set({ angle: currentAngle + 90 });
      canvas.requestRenderAll();
    }
  }, [canvas, selectedObject]);

  const handleFlipHorizontal = useCallback(() => {
    if (canvas && canvas.getContext && selectedObject && selectedObject.set) {
      selectedObject.set({ flipX: !selectedObject.flipX });
      canvas.requestRenderAll();
    }
  }, [canvas, selectedObject]);

  const handleFlipVertical = useCallback(() => {
    if (canvas && canvas.getContext && selectedObject && selectedObject.set) {
      selectedObject.set({ flipY: !selectedObject.flipY });
      canvas.requestRenderAll();
    }
  }, [canvas, selectedObject]);

  const addRectangle = useCallback(() => {
    if (!canvas) return;
    console.log('Adding rectangle to canvas');
    
    try {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 200,
        height: 100,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
      });
      
      (canvas as FabricCanvas).isInternalUpdate = true;
      
      canvas.add(rect as unknown as FabricObject);
      canvas.setActiveObject(rect as unknown as FabricObject);
      canvas.requestRenderAll();
      
      setTimeout(() => {
        (canvas as FabricCanvas).isInternalUpdate = false;
        const state = JSON.stringify(canvas.toJSON());
        addToHistory(state);
      }, 100);
      
      console.log('Rectangle added successfully');
    } catch (error) {
      console.error('Error adding rectangle:', error);
    }
  }, [canvas, addToHistory]);

  const addCircle = useCallback(() => {
    if (!canvas) return;
    console.log('Adding circle to canvas');
    
    try {
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: '#10b981',
        stroke: '#047857',
        strokeWidth: 2,
      });
      
      (canvas as FabricCanvas).isInternalUpdate = true;
      
      canvas.add(circle as unknown as FabricObject);
      canvas.setActiveObject(circle as unknown as FabricObject);
      canvas.requestRenderAll();
      
      setTimeout(() => {
        (canvas as FabricCanvas).isInternalUpdate = false;
        const state = JSON.stringify(canvas.toJSON());
        addToHistory(state);
      }, 100);
      
      console.log('Circle added successfully');
    } catch (error) {
      console.error('Error adding circle:', error);
    }
  }, [canvas, addToHistory]);

  const addText = useCallback(() => {
    if (!canvas) return;
    console.log('Adding text to canvas');
    
    try {
      const text = new fabric.IText('Click to edit', {
        left: 100,
        top: 100,
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#000000',
      });
      
      (canvas as FabricCanvas).isInternalUpdate = true;
      
      canvas.add(text as unknown as FabricObject);
      canvas.setActiveObject(text as unknown as FabricObject);
      canvas.requestRenderAll();
      
      setTimeout(() => {
        (canvas as FabricCanvas).isInternalUpdate = false;
        const state = JSON.stringify(canvas.toJSON());
        addToHistory(state);
      }, 100);
      
      console.log('Text added successfully');
    } catch (error) {
      console.error('Error adding text:', error);
    }
  }, [canvas, addToHistory]);

  const startCrop = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    setActiveTool('crop');
    console.log('Crop mode activated - select an area to crop');
  }, [canvas, selectedObject, setActiveTool]);

  return (
    <div className="flex items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex gap-1 pr-2 border-r border-gray-200 dark:border-gray-600">
        <ToolButton
          icon={<MousePointer size={20} />}
          label="Select"
          onClick={() => setActiveTool('select')}
          active={activeTool === 'select'}
        />
        <ToolButton
          icon={<Pencil size={20} />}
          label="Draw"
          onClick={() => setActiveTool('draw')}
          active={activeTool === 'draw'}
        />
      </div>

      <div className="flex gap-1 pr-2 border-r border-gray-200 dark:border-gray-600">
        <ToolButton
          icon={<Square size={20} />}
          label="Rectangle"
          onClick={addRectangle}
        />
        <ToolButton
          icon={<Circle size={20} />}
          label="Circle"
          onClick={addCircle}
        />
        <ToolButton
          icon={<Type size={20} />}
          label="Text"
          onClick={() => {
            addText();
            if (onOpenTextStyle) {
              setTimeout(onOpenTextStyle, 100);
            }
          }}
        />
      </div>

      <div className="flex gap-1 pr-2 border-r border-gray-200 dark:border-gray-600">
        <ToolButton
          icon={<Crop size={20} />}
          label="Crop"
          onClick={startCrop}
          active={activeTool === 'crop'}
          disabled={!selectedObject}
        />
        <ToolButton
          icon={<RotateCw size={20} />}
          label="Rotate"
          onClick={handleRotate}
          disabled={!selectedObject}
        />
        <ToolButton
          icon={<FlipHorizontal size={20} />}
          label="Flip Horizontal"
          onClick={handleFlipHorizontal}
          disabled={!selectedObject}
        />
        <ToolButton
          icon={<FlipVertical size={20} />}
          label="Flip Vertical"
          onClick={handleFlipVertical}
          disabled={!selectedObject}
        />
      </div>

      <div className="flex gap-1 pr-2 border-r border-gray-200 dark:border-gray-600">
        <ToolButton
          icon={<Undo size={20} />}
          label="Undo"
          onClick={undo}
          disabled={!canUndo}
        />
        <ToolButton
          icon={<Redo size={20} />}
          label="Redo"
          onClick={redo}
          disabled={!canRedo}
        />
      </div>

      <div className="flex gap-1 pr-2 border-r border-gray-200 dark:border-gray-600">
        <ToolButton
          icon={<Trash2 size={20} />}
          label="Delete"
          onClick={handleDelete}
          disabled={!selectedObject}
        />
        <ToolButton
          icon={<Settings2 size={20} />}
          label="Text Style"
          onClick={() => {
            if (selectedObject && selectedObject.type === 'i-text' && onOpenTextStyle) {
              onOpenTextStyle();
            } else if (!selectedObject) {
              if (onOpenTextStyle) onOpenTextStyle();
            } else {
              alert('Please select a text layer to customize');
            }
          }}
          active={!!(selectedObject && selectedObject.type === 'i-text')}
        />
        <ToolButton
          icon={<Palette size={20} />}
          label="Filters"
          onClick={onOpenFilters}
        />
        <ToolButton
          icon={<Layers size={20} />}
          label="Layers"
          onClick={onOpenLayers}
        />
      </div>

      <div className="flex gap-1">
        <ToolButton
          icon={<Download size={20} />}
          label="Export"
          onClick={onExport}
        />
      </div>
    </div>
  );
};