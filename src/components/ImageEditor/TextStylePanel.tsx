'use client';

import * as React from 'react';
import { useState, useEffect} from 'react';
import { 
  X, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  ChevronDown,
  Minus,
  Plus
} from 'lucide-react';
import { useEditor, type FabricCanvas, type FabricObject } from '@/contexts/EditorContext';
import { HexColorPicker } from 'react-colorful';
import * as fabric from 'fabric';

interface ITextObject extends FabricObject {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string | number;
  fontStyle: string;
  fill: string;
  textAlign: string;
  lineHeight: number;
  charSpacing: number;
  underline: boolean;
  stroke?: string | null;
  strokeWidth?: number;
}

interface TextStylePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const googleFonts = [
  { name: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', category: 'sans-serif' },
  { name: 'Lato', category: 'sans-serif' },
  { name: 'Montserrat', category: 'sans-serif' },
  { name: 'Poppins', category: 'sans-serif' },
  { name: 'Raleway', category: 'sans-serif' },
  { name: 'Inter', category: 'sans-serif' },
  { name: 'Nunito', category: 'sans-serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'Georgia', category: 'serif' },
  { name: 'Roboto Slab', category: 'serif' },
  { name: 'Bebas Neue', category: 'display' },
  { name: 'Oswald', category: 'display' },
  { name: 'Anton', category: 'display' },
  { name: 'Permanent Marker', category: 'handwriting' },
  { name: 'Pacifico', category: 'handwriting' },
  { name: 'Dancing Script', category: 'handwriting' },
  { name: 'Caveat', category: 'handwriting' },
  { name: 'Roboto Mono', category: 'monospace' },
  { name: 'Source Code Pro', category: 'monospace' },
  { name: 'JetBrains Mono', category: 'monospace' },
];

const fontWeights = [
  { label: 'Thin', value: 100 },
  { label: 'Light', value: 300 },
  { label: 'Regular', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semibold', value: 600 },
  { label: 'Bold', value: 700 },
  { label: 'Black', value: 900 },
];

export const TextStylePanel: React.FC<TextStylePanelProps> = ({ isOpen, onClose }) => {
  const { canvas, selectedObject } = useEditor();
  const [selectedFont, setSelectedFont] = useState('Roboto');
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState(400);
  const [textColor, setTextColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textDecoration, setTextDecoration] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [isLoadingFont, setIsLoadingFont] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  const loadGoogleFont = async (fontName: string) => {
    if (loadedFonts.has(fontName)) return;

    setIsLoadingFont(true);
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@100;300;400;500;600;700;900&display=swap`;
    
    const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      await new Promise((resolve) => {
        link.onload = () => resolve(true);
        setTimeout(() => resolve(false), 3000);
      });
    }

    setLoadedFonts(prev => new Set(prev).add(fontName));
    setIsLoadingFont(false);
  };

  useEffect(() => {
    if (selectedObject && selectedObject.type === 'i-text') {
      const textObj = selectedObject as ITextObject;
      setFontSize(textObj.fontSize || 24);
      setSelectedFont(textObj.fontFamily || 'Roboto');
      setFontWeight(textObj.fontWeight as number || 400);
      setTextColor(textObj.fill as string || '#000000');
      setTextAlign(textObj.textAlign || 'left');
      setLineHeight(textObj.lineHeight || 1.2);
      setLetterSpacing((textObj.charSpacing || 0) / 10);
      setTextDecoration({
        bold: textObj.fontWeight === 'bold' || (textObj.fontWeight as number) >= 700,
        italic: textObj.fontStyle === 'italic',
        underline: textObj.underline || false,
      });
      
      if (textObj.fontFamily && !loadedFonts.has(textObj.fontFamily)) {
        loadGoogleFont(textObj.fontFamily);
      }
    }
  }, [selectedObject]);

  const applyTextStyle = async (property: string, value: string | number | boolean) => {
    if (!canvas || !selectedObject || selectedObject.type !== 'i-text') return;

    const textObj = selectedObject as ITextObject;
    
    (canvas as FabricCanvas).isInternalUpdate = true;
    
    if (textObj.set) {
      switch (property) {
        case 'fontFamily':
          await loadGoogleFont(value as string);
          textObj.set({ fontFamily: value });
          break;
        case 'fontSize':
          textObj.set({ fontSize: value });
          break;
        case 'fontWeight':
          textObj.set({ fontWeight: value });
          break;
        case 'fill':
          textObj.set({ fill: value });
          break;
        case 'textAlign':
          textObj.set({ textAlign: value });
          break;
        case 'lineHeight':
          textObj.set({ lineHeight: value });
          break;
        case 'charSpacing':
          textObj.set({ charSpacing: (value as number) * 10 });
          break;
        case 'fontStyle':
          textObj.set({ fontStyle: value ? 'italic' : 'normal' });
          break;
        case 'underline':
          textObj.set({ underline: value });
          break;
      }
    }

    canvas.requestRenderAll();
    
    setTimeout(() => {
      (canvas as FabricCanvas).isInternalUpdate = false;
    }, 100);
  };

  const handleFontChange = async (fontName: string) => {
    setSelectedFont(fontName);
    setShowFontDropdown(false);
    await applyTextStyle('fontFamily', fontName);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.max(8, Math.min(200, newSize));
    setFontSize(size);
    applyTextStyle('fontSize', size);
  };

  const handleFontWeightChange = (weight: number) => {
    setFontWeight(weight);
    applyTextStyle('fontWeight', weight);
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    applyTextStyle('fill', color);
  };

  const handleAlignmentChange = (alignment: string) => {
    setTextAlign(alignment);
    applyTextStyle('textAlign', alignment);
  };

  const handleLineHeightChange = (height: number) => {
    setLineHeight(height);
    applyTextStyle('lineHeight', height);
  };

  const handleLetterSpacingChange = (spacing: number) => {
    setLetterSpacing(spacing);
    applyTextStyle('charSpacing', spacing);
  };

  const toggleTextDecoration = (type: 'bold' | 'italic' | 'underline') => {
    const newDecoration = { ...textDecoration };
    newDecoration[type] = !newDecoration[type];
    setTextDecoration(newDecoration);

    if (type === 'bold') {
      applyTextStyle('fontWeight', newDecoration.bold ? 700 : 400);
    } else if (type === 'italic') {
      applyTextStyle('fontStyle', newDecoration.italic);
    } else if (type === 'underline') {
      applyTextStyle('underline', newDecoration.underline);
    }
  };

  const addStyledText = async () => {
    if (!canvas) return;

    await loadGoogleFont(selectedFont);

    const text = new fabric.IText('Click to edit text', {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fontFamily: selectedFont,
      fontWeight: fontWeight,
      fill: textColor,
      textAlign: textAlign as 'left' | 'center' | 'right' | 'justify',
      lineHeight: lineHeight,
      charSpacing: letterSpacing * 10,
      fontStyle: textDecoration.italic ? 'italic' : 'normal',
      underline: textDecoration.underline,
    });

    (canvas as FabricCanvas).isInternalUpdate = true;
    canvas.add(text as unknown as FabricObject);
    canvas.setActiveObject(text as unknown as FabricObject);
    canvas.requestRenderAll();
    
    setTimeout(() => {
      (canvas as FabricCanvas).isInternalUpdate = false;
    }, 100);
  };

  if (!isOpen) return null;

  const isTextSelected = selectedObject && selectedObject.type === 'i-text';
  const selectedText = isTextSelected ? (selectedObject as ITextObject).text : null;

  return (
    <div className="fixed right-4 top-20 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 z-50 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Type size={20} />
          Text Styling
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {isTextSelected && selectedText && (
        <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <p className="text-xs text-green-700 dark:text-green-300">
            Editing: &ldquo;{selectedText.substring(0, 30)}{selectedText.length > 30 ? '...' : ''}&rdquo;
          </p>
        </div>
      )}

      {!isTextSelected && (
        <div className="mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded mb-3">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              No text selected. You can:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mb-3 ml-4 list-disc">
              <li>Click on any text in the canvas to edit it</li>
              <li>Select a text layer from the Layers panel</li>
              <li>Add new styled text below</li>
            </ul>
            <button
              onClick={addStyledText}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add New Text
            </button>
          </div>
          
          {canvas && (() => {
            const textLayers = canvas.getObjects().filter(obj => obj.type === 'i-text');
            if (textLayers.length > 0) {
              return (
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <p className="text-sm font-medium mb-2">Quick Select Text Layer:</p>
                  <div className="space-y-1">
                    {textLayers.map((textObj, index) => {
                      const text = (textObj as ITextObject).text || 'Untitled';
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            canvas.setActiveObject(textObj);
                            canvas.requestRenderAll();
                          }}
                          className="w-full text-left px-2 py-1 text-sm bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors truncate"
                        >
                          {index + 1}. {text.substring(0, 40)}{text.length > 40 ? '...' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Font Family</label>
        <div className="relative">
          <button
            onClick={() => setShowFontDropdown(!showFontDropdown)}
            disabled={!isTextSelected}
            className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-left cursor-pointer disabled:opacity-50 flex items-center justify-between"
          >
            <span>{selectedFont}</span>
            <ChevronDown className="pointer-events-none" size={16} />
          </button>
          
          {showFontDropdown && isTextSelected && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
              {googleFonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => handleFontChange(font.name)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
                  style={{ fontFamily: loadedFonts.has(font.name) ? font.name : 'inherit' }}
                >
                  {font.name} <span className="text-xs text-gray-500">({font.category})</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {isLoadingFont && (
          <p className="text-xs text-gray-500 mt-1">Loading font...</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFontSizeChange(fontSize - 2)}
              disabled={!isTextSelected}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              disabled={!isTextSelected}
              className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 disabled:opacity-50"
            />
            <button
              onClick={() => handleFontSizeChange(fontSize + 2)}
              disabled={!isTextSelected}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Weight</label>
          <select
            value={fontWeight}
            onChange={(e) => handleFontWeightChange(Number(e.target.value))}
            disabled={!isTextSelected}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 disabled:opacity-50"
          >
            {fontWeights.map((weight) => (
              <option key={weight.value} value={weight.value}>
                {weight.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Color</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            disabled={!isTextSelected}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: textColor }}
            />
            <span className="text-sm">{textColor}</span>
          </button>
        </div>
        {showColorPicker && isTextSelected && (
          <div className="mt-2">
            <HexColorPicker color={textColor} onChange={handleColorChange} />
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Style</label>
        <div className="flex gap-2">
          <button
            onClick={() => toggleTextDecoration('bold')}
            disabled={!isTextSelected}
            className={`p-2 rounded transition-colors disabled:opacity-50 ${
              textDecoration.bold
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => toggleTextDecoration('italic')}
            disabled={!isTextSelected}
            className={`p-2 rounded transition-colors disabled:opacity-50 ${
              textDecoration.italic
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => toggleTextDecoration('underline')}
            disabled={!isTextSelected}
            className={`p-2 rounded transition-colors disabled:opacity-50 ${
              textDecoration.underline
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Underline size={18} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Alignment</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleAlignmentChange('left')}
            disabled={!isTextSelected}
            className={`p-2 rounded transition-colors disabled:opacity-50 ${
              textAlign === 'left'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => handleAlignmentChange('center')}
            disabled={!isTextSelected}
            className={`p-2 rounded transition-colors disabled:opacity-50 ${
              textAlign === 'center'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => handleAlignmentChange('right')}
            disabled={!isTextSelected}
            className={`p-2 rounded transition-colors disabled:opacity-50 ${
              textAlign === 'right'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <AlignRight size={18} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Line Height: {lineHeight.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={lineHeight}
          onChange={(e) => handleLineHeightChange(Number(e.target.value))}
          disabled={!isTextSelected}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 disabled:opacity-50"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Letter Spacing: {letterSpacing}px
        </label>
        <input
          type="range"
          min="-5"
          max="20"
          step="0.5"
          value={letterSpacing}
          onChange={(e) => handleLetterSpacingChange(Number(e.target.value))}
          disabled={!isTextSelected}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 disabled:opacity-50"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Additional Options</label>
        <button
          onClick={() => {
            if (selectedObject && selectedObject.type === 'i-text') {
              const textObj = selectedObject as ITextObject;
              const hasStroke = textObj.stroke && textObj.strokeWidth;
              if (textObj.set) {
                if (hasStroke) {
                  textObj.set({ stroke: null, strokeWidth: 0 });
                } else {
                  textObj.set({ stroke: '#000000', strokeWidth: 2 });
                }
              }
              canvas?.requestRenderAll();
            }
          }}
          disabled={!isTextSelected}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Toggle Outline
        </button>
      </div>
    </div>
  );
};