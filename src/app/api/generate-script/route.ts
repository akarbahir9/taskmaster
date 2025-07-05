import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/ai/script-generator';
import { ScriptGenerationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ScriptGenerationRequest = await request.json();
    
    // Validate required fields
    if (!body.title || !body.logline || !body.genres || !body.tones || !body.synopsis || !body.characters) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate the script
    const result = await generateScript(body);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to generate script' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Script generation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}