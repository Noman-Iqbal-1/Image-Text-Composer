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

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Canvas**: Fabric.js for image manipulation
- **Styling**: Tailwind CSS
- **Language**: TypeScript with strict configuration
- **Image Processing**: Browser-based compression and filtering

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linter

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Delete/Backspace` | Remove selected object |
| `Ctrl/Cmd + S` | Open export dialog |
| `Ctrl/Cmd + L` | Toggle layers panel |
| `Ctrl/Cmd + F` | Toggle filters panel |
| `Ctrl/Cmd + T` | Toggle text style panel |

## Architecture

### Core Components

- **EditorProvider**: Global state management with React Context
- **ImageEditor**: Main editor interface with panel management
- **Canvas**: Fabric.js canvas wrapper with client-side rendering
- **Toolbar**: Tool selection and editor controls
- **FilterPanel**: Image filter controls
- **LayerPanel**: Layer management interface
- **TextStylePanel**: Text formatting options
- **ExportModal**: Export functionality with format options

### State Management

The application uses React Context (`EditorContext`) to manage:
- Canvas instance and selected objects
- Active tool and editor modes
- Layer hierarchy and visibility
- Undo/redo history with JSON snapshots
- Image filters and export settings

### Client-Side Architecture

The editor components are dynamically imported with SSR disabled to ensure Fabric.js only loads in the browser environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Create a pull request

## License

This project is open source and available under the MIT License.
