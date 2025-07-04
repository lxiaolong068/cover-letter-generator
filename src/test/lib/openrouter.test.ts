import { describe, it, expect, beforeEach } from 'vitest';
import { AVAILABLE_MODELS, MODEL_CONFIGS, getModel, getConfiguredModel } from '@/lib/openrouter';

describe('OpenRouter Configuration', () => {
  beforeEach(() => {
    // Mock environment variable
    process.env.OPENROUTER_API_KEY = 'test-api-key';
  });

  describe('AVAILABLE_MODELS', () => {
    it('should contain expected model mappings', () => {
      expect(AVAILABLE_MODELS).toHaveProperty('gpt-4o');
      expect(AVAILABLE_MODELS).toHaveProperty('gpt-4o-mini');
      expect(AVAILABLE_MODELS).toHaveProperty('claude-3-5-sonnet');
      expect(AVAILABLE_MODELS['gpt-4o']).toBe('openai/gpt-4o');
      expect(AVAILABLE_MODELS['claude-3-5-sonnet']).toBe('anthropic/claude-3.5-sonnet');
    });
  });

  describe('MODEL_CONFIGS', () => {
    it('should have valid configuration for cover letter generation', () => {
      const config = MODEL_CONFIGS.coverLetter;
      expect(config).toHaveProperty('model');
      expect(config).toHaveProperty('maxTokens');
      expect(config).toHaveProperty('temperature');
      expect(config.maxTokens).toBeGreaterThan(0);
      expect(config.temperature).toBeGreaterThanOrEqual(0);
      expect(config.temperature).toBeLessThanOrEqual(1);
    });

    it('should have valid configuration for analysis', () => {
      const config = MODEL_CONFIGS.analysis;
      expect(config).toHaveProperty('model');
      expect(config).toHaveProperty('maxTokens');
      expect(config).toHaveProperty('temperature');
      expect(config.maxTokens).toBeGreaterThan(0);
    });

    it('should have valid configuration for quick responses', () => {
      const config = MODEL_CONFIGS.quick;
      expect(config).toHaveProperty('model');
      expect(config).toHaveProperty('maxTokens');
      expect(config).toHaveProperty('temperature');
      expect(config.maxTokens).toBeGreaterThan(0);
    });
  });

  describe('getModel', () => {
    it('should return a model instance for valid model key', () => {
      const model = getModel('gpt-4o-mini');
      expect(model).toBeDefined();
    });

    it('should use default model when no key provided', () => {
      const model = getModel();
      expect(model).toBeDefined();
    });
  });

  describe('getConfiguredModel', () => {
    it('should return model and config for cover letter generation', () => {
      const result = getConfiguredModel('coverLetter');
      expect(result).toHaveProperty('model');
      expect(result).toHaveProperty('config');
      expect(result.config).toHaveProperty('maxTokens');
      expect(result.config).toHaveProperty('temperature');
    });

    it('should return model and config for analysis', () => {
      const result = getConfiguredModel('analysis');
      expect(result).toHaveProperty('model');
      expect(result).toHaveProperty('config');
    });

    it('should return model and config for quick responses', () => {
      const result = getConfiguredModel('quick');
      expect(result).toHaveProperty('model');
      expect(result).toHaveProperty('config');
    });
  });
});
