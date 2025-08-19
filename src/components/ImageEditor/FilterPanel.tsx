'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X, Sun, Contrast, Droplets, Eye } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import * as fabric from 'fabric';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SliderProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, icon, value, min, max, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm text-gray-500">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  </div>
);

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const { canvas, filters, setFilters, addToHistory } = useEditor();
  const [localFilters, setLocalFilters] = useState(filters);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const originalFiltersRef = useRef<fabric.filters.BaseFilter<string, Record<string, unknown>, Record<string, unknown>>[]>([]);
  const selectedImageRef = useRef<fabric.FabricImage | null>(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const applyPreview = (previewFilters: typeof localFilters) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    
    if (activeObject && (activeObject.type === 'image' || activeObject.type === 'Image')) {
      const imageObj = activeObject as fabric.FabricImage;
      
      if (!isPreviewActive) {
        originalFiltersRef.current = imageObj.filters ? [...imageObj.filters] : [];
        selectedImageRef.current = imageObj;
        setIsPreviewActive(true);
      }
      
      imageObj.filters = [];

      if (previewFilters.brightness !== 0) {
        const brightnessFilter = new fabric.filters.Brightness({
          brightness: previewFilters.brightness / 100
        });
        imageObj.filters.push(brightnessFilter);
      }

      if (previewFilters.contrast !== 0) {
        const contrastFilter = new fabric.filters.Contrast({
          contrast: previewFilters.contrast / 100
        });
        imageObj.filters.push(contrastFilter);
      }

      if (previewFilters.saturation !== 0) {
        const saturationFilter = new fabric.filters.Saturation({
          saturation: previewFilters.saturation / 100
        });
        imageObj.filters.push(saturationFilter);
      }

      if (previewFilters.blur > 0) {
        const blurFilter = new fabric.filters.Blur({
          blur: previewFilters.blur / 100
        });
        imageObj.filters.push(blurFilter);
      }

      imageObj.applyFilters();
      canvas.requestRenderAll();
    }
  };

  const handleFilterChange = (filterType: string, value: number) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    applyPreview(newFilters);
  };

  const applyFilters = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    
    if (activeObject && (activeObject.type === 'image' || activeObject.type === 'Image')) {
      setFilters(localFilters);
      setIsPreviewActive(false);
      originalFiltersRef.current = [];
      selectedImageRef.current = null;
      
      const state = JSON.stringify(canvas.toJSON());
      if (addToHistory) {
        addToHistory(state);
      }
      
      console.log('Filters applied permanently');
    } else {
      alert('Please select an image to apply filters');
    }
  };

  const cancelChanges = () => {
    if (isPreviewActive && selectedImageRef.current) {
      selectedImageRef.current.filters = originalFiltersRef.current;
      selectedImageRef.current.applyFilters();
      canvas?.requestRenderAll();
      
      setLocalFilters(filters);
      setIsPreviewActive(false);
      originalFiltersRef.current = [];
      selectedImageRef.current = null;
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
    };
    setLocalFilters(defaultFilters);
    applyPreview(defaultFilters);
  };

  const applyPresetFilter = (preset: string) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    
    if (activeObject && (activeObject.type === 'image' || activeObject.type === 'Image')) {
      const imageObj = activeObject as fabric.FabricImage;
      
      if (!isPreviewActive) {
        originalFiltersRef.current = imageObj.filters ? [...imageObj.filters] : [];
        selectedImageRef.current = imageObj;
        setIsPreviewActive(true);
      }
      
      imageObj.filters = [];

      switch (preset) {
        case 'grayscale':
          imageObj.filters.push(new fabric.filters.Grayscale());
          break;
        case 'sepia':
          imageObj.filters.push(new fabric.filters.Sepia());
          break;
        case 'invert':
          imageObj.filters.push(new fabric.filters.Invert());
          break;
        case 'vintage':
          imageObj.filters.push(new fabric.filters.Sepia());
          imageObj.filters.push(new fabric.filters.Contrast({ contrast: 0.2 }));
          imageObj.filters.push(new fabric.filters.Brightness({ brightness: -0.1 }));
          break;
        case 'cold':
          imageObj.filters.push(new fabric.filters.HueRotation({ rotation: -0.1 }));
          break;
        case 'warm':
          imageObj.filters.push(new fabric.filters.HueRotation({ rotation: 0.1 }));
          break;
      }

      imageObj.applyFilters();
      canvas.requestRenderAll();
      
      setLocalFilters({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        blur: 0,
      });
    } else {
      alert('Please select an image to apply filters');
    }
  };

  const handleClose = () => {
    cancelChanges();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 z-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters & Adjustments</h3>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {isPreviewActive && (
        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-sm text-yellow-800 dark:text-yellow-200">
          Preview mode - Click Apply to save changes
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Preset Filters</h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Grayscale', value: 'grayscale' },
            { name: 'Sepia', value: 'sepia' },
            { name: 'Invert', value: 'invert' },
            { name: 'Vintage', value: 'vintage' },
            { name: 'Cold', value: 'cold' },
            { name: 'Warm', value: 'warm' },
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => applyPresetFilter(preset.value)}
              className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <Slider
          label="Brightness"
          icon={<Sun size={16} />}
          value={localFilters.brightness}
          min={-100}
          max={100}
          onChange={(value) => handleFilterChange('brightness', value)}
        />
        <Slider
          label="Contrast"
          icon={<Contrast size={16} />}
          value={localFilters.contrast}
          min={-100}
          max={100}
          onChange={(value) => handleFilterChange('contrast', value)}
        />
        <Slider
          label="Saturation"
          icon={<Droplets size={16} />}
          value={localFilters.saturation}
          min={-100}
          max={100}
          onChange={(value) => handleFilterChange('saturation', value)}
        />
        <Slider
          label="Blur"
          icon={<Eye size={16} />}
          value={localFilters.blur}
          min={0}
          max={100}
          onChange={(value) => handleFilterChange('blur', value)}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={cancelChanges}
          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};