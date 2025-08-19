'use client';

import * as React from 'react';
import { useState } from 'react';
import { X, Download, FileImage } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { canvas } = useEditor();
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(90);
  const [fileName, setFileName] = useState('edited-image');

  const handleExport = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: format,
      quality: quality / 100,
      multiplier: 1,
    });

    const link = document.createElement('a');
    link.download = `${fileName}.${format}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  const handleCopyToClipboard = async () => {
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          alert('Image copied to clipboard!');
        }
      }, `image/${format}`, quality / 100);
    } catch (err) {
      console.error('Failed to copy image:', err);
      alert('Failed to copy image to clipboard');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileImage size={20} />
            Export Image
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter file name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Format</label>
          <div className="grid grid-cols-3 gap-2">
            {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`
                  px-4 py-2 rounded-lg border transition-all uppercase text-sm font-medium
                  ${format === fmt
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {format !== 'png' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Quality: {quality}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        )}

        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Format:</strong> {format.toUpperCase()}
            <br />
            {format !== 'png' && (
              <>
                <strong>Quality:</strong> {quality}%
                <br />
              </>
            )}
            <strong>Resolution:</strong> {canvas?.getWidth()} × {canvas?.getHeight()}px
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyToClipboard}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};