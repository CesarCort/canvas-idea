import { ModelOption, AppConfig } from '@/types';

// Available text models
export const TEXT_MODELS: ModelOption[] = [
  {
    id: 'openai/gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
  },
  {
    id: 'openai/gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
  },
];

// Available image models
export const IMAGE_MODELS: ModelOption[] = [
  {
    id: 'openai/dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
  },
  {
    id: 'openai/dall-e-2',
    name: 'DALL-E 2',
    provider: 'OpenAI',
  },
  {
    id: 'stability-ai/stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
  },
];

// Default configuration
export const DEFAULT_CONFIG: AppConfig = {
  apiKey: '',
  textModel: 'openai/gpt-3.5-turbo',
  imageModel: 'openai/dall-e-2',
  temperature: 0.7,
  maxTokens: 2000,
  apiBaseUrl: 'https://openrouter.ai/api/v1',
};

// LocalStorage keys
export const STORAGE_KEYS = {
  BOARDS: 'canvas-ia-boards',
  CONFIG: 'canvas-ia-config',
  CURRENT_BOARD_ID: 'canvas-ia-current-board-id',
};

// Node default sizes
export const NODE_SIZES = {
  TEXT_SOURCE: { width: 400, height: 300 },
  QUESTION: { width: 300, height: 150 },
  ANSWER: { width: 350, height: 250 },
  SUMMARY: { width: 400, height: 300 },
  PITCH: { width: 400, height: 350 },
  IMAGES: { width: 450, height: 400 },
};

// System prompts for different node types
export const SYSTEM_PROMPTS = {
  ANSWER: 'You are a helpful assistant. Answer the question based on the provided context clearly and concisely.',
  SUMMARY: 'You are a summarization expert. Create clear, concise bullet points that capture the key information.',
  PITCH_SHORT: 'You are a pitch expert. Create a compelling 1-minute pitch that captures the essence of the content in a narrative, engaging way.',
  PITCH_DETAILED: 'You are a pitch expert. Create a detailed 3-minute pitch that tells a compelling story and covers all important aspects of the content.',
  IMAGE_PROMPT: 'You are an expert at creating image generation prompts. Based on the content provided, create a detailed, visual prompt for image generation.',
};
