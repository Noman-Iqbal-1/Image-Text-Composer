'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { useEditor } from '@/contexts/EditorContext';

interface DropZoneProps {
  onImageLoad: (url: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onImageLoad }) => {
  const { setImageFile } = useEditor();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      let processedFile = file;
      if (file.size > 5 * 1024 * 1024) {
        const options = {
          maxSizeMB: 5,
          maxWidthOrHeight: 2048,
          useWebWorker: true,
        };
        processedFile = await imageCompression(file, options);
      }

      setImageFile(processedFile);
      const url = URL.createObjectURL(processedFile);
      onImageLoad(url);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }, [onImageLoad, setImageFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-all duration-200 hover:border-blue-500
        ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-300 dark:border-gray-600'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <>
            <ImageIcon className="w-16 h-16 text-blue-500" />
            <p className="text-lg font-medium">Drop your image here</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400" />
            <div>
              <p className="text-lg font-medium">Drag & drop an image here</p>
              <p className="text-sm text-gray-500 mt-1">or click to select</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Supports: JPG, PNG, WebP, GIF, BMP (Max 50MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};