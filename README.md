# ScriptSpark - AI-Powered Movie Script Generator

Transform your movie ideas into professional screenplays with the power of AI. ScriptSpark creates compelling stories with rich characters and industry-standard formatting.

## Features

- **AI-Powered Generation**: Advanced AI creates compelling, professionally formatted screenplays from your ideas
- **Industry Standard Format**: Scripts follow professional screenplay formatting with proper scene headings and dialogue
- **Rich Character Development**: Create detailed character profiles with motivations, arcs, and personality traits
- **Interactive Editor**: Edit and refine your generated scripts with our built-in screenplay editor
- **Multiple Export Formats**: Download your scripts in PDF, Final Draft, or plain text formats
- **Genre Flexibility**: Create scripts in any genre or blend multiple genres for unique storytelling

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Google AI API key:
```
GOOGLE_AI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:9002](http://localhost:9002) in your browser

## How to Use

### Creating a Script

1. **Basic Information**
   - Enter your project title
   - Write a compelling logline (one-sentence plot summary)
   - Select up to 2 genres
   - Choose up to 3 tones

2. **Story Synopsis**
   - Provide a detailed 500-1000 word outline
   - Include main plot points and turning points
   - Describe the overall narrative arc

3. **Character Development**
   - Add multiple characters with detailed profiles
   - Define roles (protagonist, antagonist, supporting)
   - Specify archetypes and motivations
   - Describe character arcs

4. **Generate & Edit**
   - Click "Generate Script" to create your screenplay
   - Edit the generated script in the built-in editor
   - Save changes automatically

### Managing Scripts

- View all your scripts in the "My Scripts" section
- Edit existing scripts with the interactive editor
- Download scripts in multiple formats (TXT, PDF, FDX)
- Delete scripts you no longer need

## Supported Genres

- Action
- Comedy
- Drama
- Horror
- Thriller
- Sci-Fi
- Fantasy
- Romance
- Mystery
- Western

## Tone Options

- Gritty
- Lighthearted
- Suspenseful
- Hopeful
- Dark
- Satirical
- Whimsical
- Serious
- Epic
- Intimate

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **AI**: Google AI (Gemini 2.0 Flash) via GenKit
- **Forms**: React Hook Form with Zod validation
- **Storage**: Local storage (can be extended with databases)
- **Deployment**: Vercel, Netlify, or any Node.js hosting

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── create/         # Script creation page
│   ├── scripts/        # Scripts listing page
│   └── script/[id]/    # Individual script editor
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   └── navigation.tsx  # App navigation
├── ai/                # AI integration
│   ├── genkit.ts      # AI configuration
│   └── script-generator.ts # Script generation logic
├── types/             # TypeScript type definitions
└── lib/               # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

### Environment Variables

Required environment variables:

```
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

Built with ❤️ by the ScriptSpark team
