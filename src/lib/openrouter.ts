import { createOpenRouter } from '@openrouter/ai-sdk-provider';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY environment variable is required');
}

// Create OpenRouter instance with API key
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  // Optional: Add default extra body parameters
  extraBody: {
    // Add any default OpenRouter-specific parameters here
  },
});

// Available models - you can customize this list based on your needs
export const AVAILABLE_MODELS = {
  // OpenAI models via OpenRouter
  'gpt-4o': 'openai/gpt-4o',
  'gpt-4o-mini': 'openai/gpt-4o-mini',
  'gpt-4-turbo': 'openai/gpt-4-turbo',
  'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',

  // Anthropic models via OpenRouter
  'claude-3-5-sonnet': 'anthropic/claude-3.5-sonnet',
  'claude-3-haiku': 'anthropic/claude-3-haiku',
  'claude-3-opus': 'anthropic/claude-3-opus',

  // Other popular models
  'llama-3.1-70b': 'meta-llama/llama-3.1-70b-instruct',
  'llama-3.1-8b': 'meta-llama/llama-3.1-8b-instruct',
  'gemini-pro': 'google/gemini-pro',
} as const;

export type ModelKey = keyof typeof AVAILABLE_MODELS;

// Default model for cover letter generation
export const DEFAULT_MODEL: ModelKey = 'gpt-4o-mini';

// Get model instance
export function getModel(modelKey: ModelKey = DEFAULT_MODEL) {
  const modelId = AVAILABLE_MODELS[modelKey];
  return openrouter(modelId);
}

// Model configurations for different use cases
export const MODEL_CONFIGS = {
  // For cover letter generation - balance of quality and cost
  coverLetter: {
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7,
  },

  // For content analysis - higher quality
  analysis: {
    model: 'gpt-4o',
    maxTokens: 2000,
    temperature: 0.3,
  },

  // For quick responses - fast and cheap
  quick: {
    model: 'gpt-3.5-turbo',
    maxTokens: 500,
    temperature: 0.5,
  },
} as const;

export type ConfigKey = keyof typeof MODEL_CONFIGS;

// Get model with specific configuration
export function getConfiguredModel(configKey: ConfigKey) {
  const config = MODEL_CONFIGS[configKey];
  return {
    model: getModel(config.model as ModelKey),
    config: {
      maxTokens: config.maxTokens,
      temperature: config.temperature,
    },
  };
}
