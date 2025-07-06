import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
    });

    it('should handle conflicting classes with tailwind-merge', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('should handle undefined and null values', () => {
      expect(cn('px-2', undefined, 'py-1', null)).toBe('px-2 py-1');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      expect(cn('base-class', isActive && 'active-class')).toBe('base-class active-class');

      const isInactive = false;
      expect(cn('base-class', isInactive && 'inactive-class')).toBe('base-class');
    });
  });
});
