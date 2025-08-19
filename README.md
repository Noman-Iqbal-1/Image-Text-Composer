# Image Editor

A professional browser-based image editor built with Next.js and Fabric.js. Create, edit, and export images with powerful tools including filters, layers, drawing capabilities, and more.

## Features

- **Image Upload**: Drag-and-drop or click to upload images
- **Drawing Tools**: Freehand drawing with customizable brush settings
- **Shapes**: Add rectangles, circles, triangles, and other geometric shapes
- **Text Editing**: Add and style text with fonts, colors, and formatting options
- **Image Filters**: Apply brightness, contrast, saturation, and blur effects
- **Layer Management**: Organize elements with layer visibility and ordering controls
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Export Options**: Save images in multiple formats (PNG, JPEG, WebP)
- **Keyboard Shortcuts**: Efficient workflow with professional shortcuts

## Setup and Run Instructions

### Prerequisites

- **Node.js**: Version 18 or higher
- **Package Manager**: npm, yarn, pnpm, or bun
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd image-editing-tool
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Access the application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - The editor will load with an empty canvas
   - Upload an image or start drawing to begin editing

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linter

### Keyboard Shortcuts

- `Ctrl/Cmd + Z/Y` - Undo/Redo
- `Delete/Backspace` - Remove selected object
- `Ctrl/Cmd + S` - Export dialog
- `Ctrl/Cmd + L/F/T` - Toggle panels (layers/filters/text)

## Architecture Overview

### System Architecture

The image editor follows a **client-side architecture** with React Context for state management and Fabric.js for canvas operations. The application is built with Next.js App Router, utilizing server-side rendering for the shell and client-side hydration for interactive components.

**Key Architectural Decisions**:
- **Single-page application** with dynamic imports to handle client-only libraries
- **Context-based state management** for global editor state across components  
- **Component-based UI** with specialized panels for different editing functions
- **JSON-based history system** for undo/redo operations using Fabric.js serialization

### Core Components

- **EditorProvider** - Global state management with React Context
- **Canvas** - Fabric.js wrapper with client-side rendering
- **Toolbar** - Tool selection (select, draw, shapes, text, filters)
- **Panels** - Filter controls, layer management, text styling
- **Export** - Multi-format export with quality settings

### State Management

- **React Context** - Centralized state for canvas, tools, layers, and history
- **Fabric.js Integration** - Client-side loading with TypeScript interfaces
- **History System** - JSON snapshots for undo/redo functionality
- **Performance** - Selective re-rendering and memory management

## Technology Choices and Trade-offs

### Core Technology Stack

| Technology | Choice | Trade-offs |
|------------|--------|------------|
| **Frontend Framework** | Next.js 15 | ✅ App Router, SSR, Turbopack dev speed<br>❌ Bundle size, learning curve |
| **UI Library** | React 19 | ✅ Latest features, concurrent rendering<br>❌ Bleeding edge stability risk |
| **Canvas Library** | Fabric.js | ✅ Rich API, object model, filters<br>❌ Large bundle (~500KB), client-only |
| **Styling** | Tailwind CSS | ✅ Utility-first, fast development<br>❌ Class name verbosity, learning curve |
| **State Management** | React Context | ✅ Built-in, no dependencies<br>❌ Re-render optimization complexity |
| **Language** | TypeScript | ✅ Type safety, better DX<br>❌ Build complexity, initial setup time |

### Key Design Decisions

- **Fabric.js** - Rich API vs. large bundle size (~500KB)
- **React Context** - Simple setup vs. potential re-render issues  
- **Client-side** - Real-time interactions vs. browser limitations
- **Next.js App Router** - Modern features vs. complexity

## Technology Stack & Features

**Core Technologies**: Next.js 15 • React 19 • Fabric.js • TypeScript • Tailwind CSS

**Advanced Features**:
- Professional toolbar with selection, drawing, shapes, text, and filters
- Layer management with drag-to-reorder and visibility controls
- Real-time image filters (brightness, contrast, saturation, blur)
- Multi-format export (PNG, JPEG, WebP) with quality settings
- Full undo/redo history with keyboard shortcuts
- Color picker with hex input and preset palette
- Responsive design for different screen sizes

**Technical Excellence**:
- Strict TypeScript with custom Fabric.js types
- Dynamic imports and code splitting for performance
- Client-side canvas processing for real-time feedback
- Turbopack for fast development builds
- Keyboard navigation and accessibility support

## Limitations & Performance

**Browser Requirements**: Modern browsers, JavaScript enabled, 4GB+ RAM recommended

**Current Limitations**:
- No auto-save or cloud storage (session-based)
- Large bundle size (~500KB) due to Fabric.js
- Browser canvas size limits (8K max resolution)
- Limited vector editing compared to professional tools
- No layer blending modes or animation features

**Optimal Usage**: Images under 4K resolution, fewer than 20 layers