import { ai } from './genkit';
import { ScriptGenerationRequest, ScriptGenerationResponse } from '@/types';

export async function generateScript(request: ScriptGenerationRequest): Promise<ScriptGenerationResponse> {
  try {
    // Construct the AI prompt for script generation
    const prompt = buildScriptPrompt(request);
    
    // Generate the script using the AI
    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 8192,
      },
    });

    return {
      script: response.text,
      success: true,
    };
  } catch (error) {
    console.error('Script generation error:', error);
    return {
      script: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

function buildScriptPrompt(request: ScriptGenerationRequest): string {
  const { title, logline, genres, tones, synopsis, characters } = request;

  const charactersText = characters.map(char => 
    `${char.name} (${char.role}): ${char.archetype}
    - Motivation: ${char.motivation}
    - Traits: ${char.traits.join(', ')}
    - Arc: ${char.characterArc}`
  ).join('\n\n');

  return `You are a professional screenwriter. Generate a complete, feature-length movie script based on the following specifications:

TITLE: ${title}

LOGLINE: ${logline}

GENRES: ${genres.join(', ')}

TONE: ${tones.join(', ')}

SYNOPSIS: ${synopsis}

CHARACTERS:
${charactersText}

INSTRUCTIONS:
1. Create a properly formatted screenplay following industry standards
2. Use the three-act structure (Setup, Confrontation, Resolution)
3. Include scene headings (INT./EXT. LOCATION - DAY/NIGHT)
4. Write concise action lines describing visual and auditory elements
5. Format character names centered and capitalized before dialogue
6. Use parentheticals sparingly and only when necessary
7. Aim for approximately 90-120 pages of screenplay content
8. Ensure the story follows the provided synopsis and character arcs
9. Maintain the specified tone and genre throughout
10. Create compelling dialogue that reveals character and advances plot

FORMAT EXAMPLE:
FADE IN:

EXT. LOCATION - DAY

Action line describing what we see and hear.

CHARACTER NAME
Dialogue goes here.

CHARACTER NAME
(parenthetical)
More dialogue.

Generate the complete screenplay now:`;
}

export function formatScriptForDownload(script: string, format: 'pdf' | 'fdx' | 'txt' = 'txt'): string {
  // For now, return the script as-is. In a real implementation, you'd convert to different formats
  switch (format) {
    case 'pdf':
      // Would integrate with a PDF library
      return script;
    case 'fdx':
      // Would convert to Final Draft XML format
      return script;
    case 'txt':
    default:
      return script;
  }
}