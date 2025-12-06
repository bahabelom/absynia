import { AskAiDto, AskAiResponseDto } from '../dto/ask-ai.dto';

export class AiService {
  private apiKey: string | null = null;
  private projectId: string | null = null;
  private useApiKey: boolean = false;
  private cachedModels: string[] | null = null;
  private generativeModel: any = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initializes the AI service based on available credentials
   */
  private initialize() {
    this.apiKey = process.env.GOOGLE_API_KEY || null;
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_PROJECT_ID || null;

    if (this.apiKey) {
      this.useApiKey = true;
      console.log('Initialized with API key authentication');
      return;
    }

    if (this.projectId) {
      // Initialize SDK asynchronously (fire and forget)
      this.initializeSDK().catch(() => {
        // Silently handle initialization errors
      });
    } else {
      console.warn('No API key or project ID found - using mock responses');
    }
  }

  /**
   * Initializes Vertex AI SDK (for service account authentication)
   * Note: This code path only executes if no API key is provided
   */
  private async initializeSDK() {
    // This code only runs if API key is not present, so it won't execute in your setup
    try {
      // Lazy load the SDK using a separate loader to avoid build-time analysis
      const { loadVertexAI } = await import('./vertex-ai-loader');
      const vertexAIModule = await loadVertexAI();
      
      if (!vertexAIModule) {
        throw new Error('Module not found');
      }
      
      const { VertexAI } = vertexAIModule;
      const location = process.env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_LOCATION || 'us-central1';
      const model = process.env.VERTEX_AI_MODEL || 'gemini-1.5-flash';
      
      const vertexAI = new VertexAI({ project: this.projectId, location });
      this.generativeModel = vertexAI.getGenerativeModel({ model });
      
      console.log(`Initialized Vertex AI SDK with model: ${model}`);
    } catch (error) {
      console.warn('Vertex AI SDK not available - install @google-cloud/vertexai or use API key');
    }
  }

  /**
   * Generates an AI response based on the input text and language
   */
  async generateReply(dto: AskAiDto): Promise<AskAiResponseDto> {
    if (this.useApiKey && this.apiKey) {
      return this.callGeminiAPI(dto);
    }

    if (this.generativeModel) {
      return this.callVertexAISDK(dto);
    }

    return this.getMockResponse(dto);
  }

  /**
   * Calls Gemini API using API key
   */
  private async callGeminiAPI(dto: AskAiDto): Promise<AskAiResponseDto> {
    const prompt = this.buildPrompt(dto);
    const models = await this.getAvailableModels();

    for (const model of models) {
      try {
        const response = await this.generateContent(model, prompt);
        if (response) {
          return {
            inputText: dto.text,
            aiReply: response,
          };
        }
      } catch (error) {
        console.debug(`Model ${model} failed, trying next...`);
        continue;
      }
    }

    console.warn('All models failed, falling back to mock response');
    return this.getMockResponse(dto);
  }

  /**
   * Gets available models from Gemini API (with caching)
   */
  private async getAvailableModels(): Promise<string[]> {
    if (this.cachedModels && this.cachedModels.length > 0) {
      return this.cachedModels;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        if (data.models?.length) {
          const models = data.models
            .map((m: any) => m.name?.replace('models/', '') || m.name)
            .filter((name: string) => name?.includes('gemini'));
          
          if (models.length > 0) {
            this.cachedModels = models;
            return models;
          }
        }
      }
    } catch (error) {
      console.debug('Could not fetch available models');
    }

    // Fallback to common model names
    return ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  }

  /**
   * Generates content using a specific model
   */
  private async generateContent(model: string, prompt: string): Promise<string | null> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return text || null;
  }

  /**
   * Calls Vertex AI SDK (for service account authentication)
   */
  private async callVertexAISDK(dto: AskAiDto): Promise<AskAiResponseDto> {
    try {
      const prompt = this.buildPrompt(dto);
      
      const response = await this.generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const contentResponse = response.response;
      const aiReply = contentResponse.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiReply) {
        throw new Error('Invalid response structure');
      }

      return {
        inputText: dto.text,
        aiReply,
      };
    } catch (error) {
      console.error('Error calling Vertex AI SDK', error);
      return this.getMockResponse(dto);
    }
  }

  /**
   * Builds a prompt with language instruction
   */
  private buildPrompt(dto: AskAiDto): string {
    const language = dto.language || 'en';
    return `Please respond to the following message in ${language}. Keep your response natural and conversational.\n\nMessage: ${dto.text}`;
  }

  /**
   * Returns a mock response for testing purposes
   */
  private getMockResponse(dto: AskAiDto): AskAiResponseDto {
    const languageResponses: Record<string, string> = {
      en: `I received your message: "${dto.text}". This is a mock AI response in English.`,
      am: `መልዕክትዎን ተቀብያለሁ: "${dto.text}". ይህ በአማርኛ የሚሆን የሙከራ AI ምላሽ ነው።`,
      om: `Ergama keessan fudhate: "${dto.text}". Kun deebii AI fakkeessaa Afaan Oromoo keessatti.`,
      ti: `መልእኽትኩም ተቐቢለ: "${dto.text}". እዚ ናይ ሙከራ AI መልሲ ትግርኛ እዩ።`,
    };

    const language = dto.language?.toLowerCase() || 'en';
    const aiReply =
      languageResponses[language] ||
      `I received your message: "${dto.text}". This is a mock AI response. (Language: ${dto.language || 'en'})`;

    return {
      inputText: dto.text,
      aiReply,
    };
  }
}

