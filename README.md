# Canvas IA - Visual AI Canvas

A visual canvas tool for exploring text content through AI-powered questions, summaries, pitches, and image generation. Built with React, TypeScript, and React Flow.

## Features

- **Visual Canvas Interface**: Drag-and-drop nodes on an infinite canvas
- **Text Source Nodes**: Input and manage your base text content
- **AI-Powered Analysis**:
  - Ask questions about your text
  - Generate key point summaries
  - Create compelling pitches (short or detailed)
  - Generate related images
- **Node Connections**: Link nodes to provide context for AI generation
- **Local Storage**: Save and load multiple boards
- **Configurable AI Models**: Choose from various text and image generation models
- **100% Frontend**: No backend required, runs entirely in your browser

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Flow** - Visual canvas and node management
- **Zustand** - State management
- **OpenRouter** - AI model provider (supports multiple providers)

## Prerequisites

- Node.js 18+ and npm
- An OpenRouter API key ([get one here](https://openrouter.ai/keys))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd canvas-idea
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Configuration

### Setting up your API Key

1. Click the **⚙️** (Settings) icon in the header
2. Enter your OpenRouter API key
3. Select your preferred text and image models
4. Adjust temperature and other parameters as needed
5. Click "Save & Close"

> **Important**: Your API key is stored locally in your browser's localStorage and is only sent to OpenRouter. It never goes to any other server.

### Available Models

**Text Models:**
- GPT-4 Turbo / GPT-4 / GPT-3.5 Turbo (OpenAI)
- Claude 3 Opus / Sonnet (Anthropic)
- Llama 3.1 70B (Meta)

**Image Models:**
- DALL-E 3 / DALL-E 2 (OpenAI)
- Stable Diffusion XL (Stability AI)

## Usage Guide

### Creating a Board

1. Click **"New Board"** in the header
2. Enter a name for your board
3. Click "Create"

### Adding Content

1. **Text Source Node**:
   - Paste or type your base text in the left sidebar
   - Click "Create Text Node"
   - The node appears on the canvas with your text

2. **Question Node**:
   - Click "+ Question" in the sidebar
   - Connect it to a Text Source node by dragging from the source's output handle to the question's input handle
   - Type your question
   - Click "Generate Answer"

3. **Summary Node**:
   - Click "+ Summary" in the sidebar
   - Connect it to one or more nodes (Text Source, Answer, etc.)
   - Set the number of key points
   - Click "Generate Summary"

4. **Pitch Node**:
   - Click "+ Pitch" in the sidebar
   - Connect it to Summary or Text Source nodes
   - Choose "Short (1 min)" or "Detailed (3 min)"
   - Click "Generate Pitch"

5. **Images Node**:
   - Click "+ Images" in the sidebar
   - Connect it to Pitch, Summary, or Text Source nodes
   - Optionally edit the visual prompt
   - Set the number of images (1-6)
   - Click "Generate Images"

### Managing Boards

- **Save**: Click "Save" in the header to persist your current board
- **Load**: Click "Load Board" to see all saved boards and switch between them
- **Rename**: In the Board Manager, click "Rename" on any board
- **Delete**: In the Board Manager, click "Delete" (with confirmation)

### Canvas Navigation

- **Pan**: Click and drag on the background
- **Zoom**: Use mouse wheel or the +/- controls
- **Move Nodes**: Click and drag any node
- **Delete Node**: Hover over a node and click the ✕ button
- **Connect Nodes**: Drag from an output handle (right side) to an input handle (left side)

## Project Structure

```
canvas-idea/
├── docs/               # Documentation
│   └── requirements.md # Product requirements
├── src/
│   ├── assets/         # Static assets
│   ├── canvas/         # Canvas and node components
│   │   ├── nodes/      # Individual node components
│   │   └── Canvas.tsx  # Main React Flow canvas
│   ├── components/     # UI components
│   │   ├── config/     # Configuration modals
│   │   └── layout/     # Layout components
│   ├── lib/            # Utilities and API
│   │   ├── api/        # OpenRouter API integration
│   │   ├── constants.ts
│   │   ├── storage.ts  # LocalStorage helpers
│   │   └── utils.ts
│   ├── state/          # Zustand store
│   │   └── store.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Deployment

This is a static site that can be deployed to:

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the `gh-pages` branch
- **Any static hosting**: Upload the `dist` folder

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy & Security

- **No Backend**: All data is stored locally in your browser
- **API Key Security**: Your API key is stored in localStorage and only sent to OpenRouter
- **No Tracking**: This app doesn't track or collect any user data
- **Open Source**: All code is visible and auditable

## Roadmap

Future enhancements may include:

- Export boards to JSON/Markdown
- Collaborative features (requires backend)
- Custom node types
- More AI providers
- Template boards
- Keyboard shortcuts
- Undo/Redo functionality

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation in `/docs`

---

Built with ❤️ using React, TypeScript, and React Flow
