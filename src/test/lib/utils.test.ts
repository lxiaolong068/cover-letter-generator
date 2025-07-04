import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  truncateText,
  generateSlug,
  validateEmail,
  formatTokenCount,
  formatDuration,
  getInitials,
  isValidUUID,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
      expect(cn('px-2', 'px-4')).toBe('px-4'); // tailwind-merge should handle conflicts
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/December 25, 2023/);
    });

    it('should handle string dates', () => {
      const formatted = formatDate('2023-12-25');
      expect(formatted).toMatch(/December 25, 2023/);
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-12-25T10:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('Dec 25, 2023');
      expect(formatted).toContain('10:30');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for recent dates', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    it('should format minutes correctly', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should format hours correctly', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });
  });

  describe('generateSlug', () => {
    it('should generate valid slugs', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Test & Example!')).toBe('test-example');
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('formatTokenCount', () => {
    it('should format small token counts', () => {
      expect(formatTokenCount(500)).toBe('500');
      expect(formatTokenCount(999)).toBe('999');
    });

    it('should format large token counts with k suffix', () => {
      expect(formatTokenCount(1000)).toBe('1.0k');
      expect(formatTokenCount(1500)).toBe('1.5k');
      expect(formatTokenCount(10000)).toBe('10.0k');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds', () => {
      expect(formatDuration(5000)).toBe('5s');
      expect(formatDuration(30000)).toBe('30s');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(65000)).toBe('1m 5s');
      expect(formatDuration(125000)).toBe('2m 5s');
    });
  });

  describe('getInitials', () => {
    it('should get initials from names', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith Johnson')).toBe('JS');
      expect(getInitials('SingleName')).toBe('S');
    });
  });

  describe('isValidUUID', () => {
    it('should validate correct UUIDs', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(isValidUUID('invalid-uuid')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false);
      expect(isValidUUID('')).toBe(false);
    });
  });
});
