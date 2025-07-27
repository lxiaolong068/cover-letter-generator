'use client';

import { usePreloadCriticalImages, useImagePerformanceMonitoring } from '@/hooks/useImagePreloader';

/**
 * Component that preloads critical images and monitors performance
 * Should be included in the root layout for optimal performance
 */
export function ImagePreloader() {
  // Preload critical images on mount
  usePreloadCriticalImages();

  // Monitor image loading performance
  useImagePerformanceMonitoring();

  // This component doesn't render anything
  return null;
}
