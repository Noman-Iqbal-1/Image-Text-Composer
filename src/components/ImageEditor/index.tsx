'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { FilterPanel } from './FilterPanel';
import { LayerPanel } from './LayerPanel';
import { TextStylePanel } from './TextStylePanel';
import { ExportModal } from '../ExportOptions/ExportModal';
import { DropZone } from '../ImageUpload/DropZone';
import { useEditor } from '@/contexts/EditorContext';

export const ImageEditor: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showTextStyle, setShowTextStyle] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const { canvas, undo, redo } = useEditor();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (canvas) {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            canvas.remove(activeObject);
            canvas.renderAll();
          }
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        setShowExport(true);
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        setShowLayers(!showLayers);
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowFilters(!showFilters);
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        setShowTextStyle(!showTextStyle);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, undo, redo, showLayers, showFilters, showTextStyle]);

  const handleImageLoad = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Image Editor
          </h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!imageUrl ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-2xl">
              <DropZone onImageLoad={handleImageLoad} />
              <div className="mt-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Get Started</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload an image to begin editing
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Keyboard Shortcuts:</p>
                  <div className="mt-2 inline-block text-left">
                    <p>• <kbd>Ctrl/Cmd + Z</kbd> - Undo</p>
                    <p>• <kbd>Ctrl/Cmd + Y</kbd> - Redo</p>
                    <p>• <kbd>Delete</kbd> - Remove selected</p>
                    <p>• <kbd>Ctrl/Cmd + S</kbd> - Export</p>
                    <p>• <kbd>Ctrl/Cmd + L</kbd> - Toggle layers</p>
                    <p>• <kbd>Ctrl/Cmd + F</kbd> - Toggle filters</p>
                    <p>• <kbd>Ctrl/Cmd + T</kbd> - Toggle text styles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4">
              <Toolbar
                onOpenFilters={() => setShowFilters(!showFilters)}
                onOpenLayers={() => setShowLayers(!showLayers)}
                onOpenTextStyle={() => setShowTextStyle(!showTextStyle)}
                onExport={() => setShowExport(true)}
              />
            </div>

            <div className="flex-1 p-4 pt-0">
              <Canvas imageUrl={imageUrl} />
            </div>

            <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} />
            <LayerPanel isOpen={showLayers} onClose={() => setShowLayers(false)} />
            <TextStylePanel isOpen={showTextStyle} onClose={() => setShowTextStyle(false)} />
            <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />

            <button
              onClick={() => {
                setImageUrl(null);
                if (canvas) {
                  canvas.clear();
                }
              }}
              className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
            >
              New Image
            </button>
          </>
        )}
      </div>
    </div>
  );
};