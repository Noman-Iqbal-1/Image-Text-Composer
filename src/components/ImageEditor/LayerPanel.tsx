'use client';

import * as React from 'react';
import { X, Eye, EyeOff, Trash2, ChevronUp, ChevronDown, Layers as LayersIcon } from 'lucide-react';
import { useEditor, type FabricObject } from '@/contexts/EditorContext';

interface LayerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ isOpen, onClose }) => {
  const { canvas, layers, setLayers, setSelectedObject } = useEditor();

  const handleSelectLayer = (obj: FabricObject) => {
    if (canvas) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
      setSelectedObject(obj);
    }
  };

  const handleToggleVisibility = (obj: FabricObject) => {
    if (canvas) {
      obj.visible = !obj.visible;
      canvas.renderAll();
      setLayers([...canvas.getObjects()]);
    }
  };

  const handleDeleteLayer = (obj: FabricObject) => {
    if (canvas) {
      canvas.remove(obj);
      canvas.renderAll();
      setLayers([...canvas.getObjects()]);
    }
  };

  const handleMoveUp = (index: number) => {
    if (canvas && index < layers.length - 1) {
      const obj = layers[index];
      canvas.bringForward(obj);
      canvas.renderAll();
      setLayers([...canvas.getObjects()]);
    }
  };

  const handleMoveDown = (index: number) => {
    if (canvas && index > 0) {
      const obj = layers[index];
      canvas.sendBackwards(obj);
      canvas.renderAll();
      setLayers([...canvas.getObjects()]);
    }
  };

  const handleOpacityChange = (obj: FabricObject, opacity: number) => {
    if (canvas) {
      if (obj.set) {
        obj.set({ opacity: opacity / 100 });
      }
      canvas.renderAll();
    }
  };

  const getLayerName = (obj: FabricObject, index: number) => {
    if (obj.type === 'image') return `Image ${index + 1}`;
    if (obj.type === 'i-text') return `Text: ${obj.text?.substring(0, 15) || ''}...`;
    if (obj.type === 'rect') return `Rectangle ${index + 1}`;
    if (obj.type === 'circle') return `Circle ${index + 1}`;
    if (obj.type === 'path') return `Drawing ${index + 1}`;
    return `Layer ${index + 1}`;
  };

  const getLayerIcon = (obj: FabricObject) => {
    const iconClass = "w-4 h-4 text-gray-500";
    if (obj.type === 'image') return '🖼️';
    if (obj.type === 'i-text') return 'T';
    if (obj.type === 'rect') return '▢';
    if (obj.type === 'circle') return '○';
    if (obj.type === 'path') return '✏️';
    return <LayersIcon className={iconClass} />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-4 top-20 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 z-50 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <LayersIcon size={20} />
          Layers
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {layers.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No layers yet</p>
      ) : (
        <div className="space-y-2">
          {[...layers].reverse().map((layer, reversedIndex) => {
            const actualIndex = layers.length - 1 - reversedIndex;
            const isSelected = canvas?.getActiveObject() === layer;
            
            return (
              <div
                key={actualIndex}
                className={`
                  p-3 rounded-lg border transition-all cursor-pointer
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
                onClick={() => handleSelectLayer(layer)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLayerIcon(layer)}</span>
                    <span className="text-sm font-medium">
                      {getLayerName(layer, actualIndex)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(actualIndex);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      disabled={actualIndex === layers.length - 1}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(actualIndex);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      disabled={actualIndex === 0}
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(layer);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLayer(layer);
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Opacity Slider */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Opacity</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(layer.opacity || 1) * 100}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleOpacityChange(layer, Number(e.target.value));
                    }}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-xs text-gray-500 w-8">
                    {Math.round((layer.opacity || 1) * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};