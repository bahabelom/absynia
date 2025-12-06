import { NextRequest, NextResponse } from 'next/server';
import { AiService } from '@/lib/services/ai.service';
import { AskAiDto } from '@/lib/dto/ask-ai.dto';

// Initialize service instance (singleton pattern)
let aiService: AiService | null = null;

function getAiService(): AiService {
  if (!aiService) {
    aiService = new AiService();
  }
  return aiService;
}

export async function POST(request: NextRequest) {
  try {
    const body: AskAiDto = await request.json();
    
    // Validate request
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: text is required' },
        { status: 400 }
      );
    }

    const service = getAiService();
    const response = await service.generateReply({
      text: body.text,
      language: body.language || 'en',
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in ask-ai API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

