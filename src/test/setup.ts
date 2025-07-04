import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables for testing
process.env.NEON_DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.OPENROUTER_API_KEY = 'test-api-key';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Mock fetch for API tests
global.fetch = vi.fn();

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  },
});
