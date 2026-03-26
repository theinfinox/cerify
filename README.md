
# CertifyBulk

> Lightning-fast, entirely client-side PWA for generating mass high-resolution certificates locally using dynamic CSV data mappings.

![Neo-Brutalist Design](https://img.shields.io/badge/aesthetic-neo--brutalist-000000?style=flat-square)
![TypeScript](https://img.shields.io/badge/language-typescript-3178c6?style=flat-square)
![Next.js 16](https://img.shields.io/badge/framework-next.js_16-000000?style=flat-square)
![PWA Ready](https://img.shields.io/badge/pwa-ready-00c853?style=flat-square)

---

## Live Demo



🌐 [certify.govindsr.me](https://certify.govindsr.me/)

## Overview

**Cerify** empowers you to generate hundreds of crisp, high-resolution certificates entirely in your browser—securely, offline, and instantly.

- **CSV Mapping**: Map CSV columns directly to canvas text fields
- **WYSIWYG Canvas Editor**: Visual template editor with real-time preview
- **Batch Processing**: Generate thousands of certificates with Web Workers
- **Zero Server**: All processing happens client-side—your data never leaves your machine
- **ZIP Export**: Automatic batch export of all generated certificates
- **PWA Support**: Install as an app and work offline

---

## Quick Start

```bash
# Install dependencies
npm install

# Development server (port 3000)
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to begin.

---

## How It Works

1. **Upload Template Image** — Your certificate template (PNG/JPG, max 10MB)
2. **Map CSV Data** — Connect spreadsheet columns to text fields
3. **Configure Fields** — Position, style, and bind text with the canvas editor
4. **Generate & Export** — Batch-process all rows into a downloadable ZIP

---

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **State** | Zustand |
| **Canvas** | Konva + React-Konva (WYSIWYG editor) |
| **Styling** | Tailwind CSS, Neo-Brutalist components |
| **Processing** | Web Workers (OffscreenCanvas), fflate (ZIP compression) |
| **Data** | PapaParse (CSV parsing) |
| **Fonts** | Google Fonts (dynamic loading) |
| **PWA** | next-pwa |

---

## Features

### Canvas Editor
- Grid overlays (Golden Ratio, Quarters, 10×10)
- Drag-and-drop field positioning
- Real-time font preview with 50+ Google Fonts
- Text styling (bold, italic, color, alignment)
- Auto-centering & auto-shrink options

### Data Processing
- Parallel certificate generation via Web Workers
- OffscreenCanvas for high-res rendering
- Font preloading for consistency
- Smart text wrapping & overflow handling

### Export
- ZIP bundle with all generated certificates
- Preview mode (first 5 certificates)
- Progress overlay during batch processing

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout & metadata
│   ├── page.tsx            # Main app component
│   └── globals.css         # Neo-brutalist theme
├── components/
│   ├── CanvasEditor.tsx    # Konva-powered visual editor
│   ├── DataMapper.tsx      # Field configuration panel
│   ├── FontPicker.tsx      # Font selector (50+ fonts)
│   ├── Uploader.tsx        # Template & CSV upload
│   ├── PreviewModal.tsx    # Certificate preview
│   └── ...                 # Additional UI components
├── store/
│   └── useCertifyStore.ts  # Zustand state management
├── workers/
│   └── exportWorker.ts     # Web Worker for batch processing
└── public/
    └── manifest.json       # PWA manifest
```

---

## Styling: Neo-Brutalism

Built with bold, geometric aesthetics:

- **Colors**: Deep black (#0d0d0d), electric green (#00C853)
- **Typography**: Heavy weights, mono capitals, tight tracking
- **Shadows**: Mechanical box-shadows with distinct hover states
- **Components**: Thick borders (3px), sharp corners, aggressive contrast

---

## Performance

- ✅ **Client-side processing** — No server upload overhead
- ✅ **Web Workers** — Non-blocking batch generation
- ✅ **OffscreenCanvas** — Efficient high-res rendering
- ✅ **fflate** — Lightweight, fast ZIP compression
- ✅ **PWA** — Installable, works offline

---

## Browser Compatibility

- Modern Chromium-based browsers (Chrome, Edge)
- Firefox (with Web Worker support)
- Safari (macOS/iOS 15+)

**Requirements**: Web Workers, OffscreenCanvas, Blob API, File API



---

## License

Open source — use, modify, and distribute freely.

---

**Built with ❤️ by [@theinfinox](https://govindsr.me)**


