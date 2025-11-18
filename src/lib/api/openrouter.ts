import {
  AppConfig,
  TextGenerationRequest,
  TextGenerationResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
} from '@/types';

/**
 * Generates text using the configured model via OpenRouter
 */
export async function generateText(
  config: AppConfig,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('API key not configured. Please add your API key in Settings.');
  }

  const request: TextGenerationRequest = {
    model: config.textModel,
    messages,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  };

  try {
    const response = await fetch(`${config.apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Canvas IA',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed: ${response.statusText}`
      );
    }

    const data: TextGenerationResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from the API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while generating text');
  }
}

/**
 * Generates images using the configured model via OpenRouter
 */
export async function generateImages(
  config: AppConfig,
  prompt: string,
  count: number
): Promise<string[]> {
  if (!config.apiKey) {
    throw new Error('API key not configured. Please add your API key in Settings.');
  }

  // Validate count
  const validCount = Math.min(Math.max(count, 1), 6);

  const request: ImageGenerationRequest = {
    model: config.imageModel,
    prompt,
    n: validCount,
  };

  try {
    const response = await fetch(`${config.apiBaseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Canvas IA',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed: ${response.statusText}`
      );
    }

    const data: ImageGenerationResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error('No images generated from the API');
    }

    return data.data.map((img) => img.url);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while generating images');
  }
}

/**
 * Helper to build context from connected nodes
 */
export function buildContextFromText(texts: string[]): string {
  return texts.filter(Boolean).join('\n\n---\n\n');
}
