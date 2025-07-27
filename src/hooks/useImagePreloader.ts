'use client';

import { useEffect, useCallback } from 'react';

interface PreloadImageOptions {
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

interface PreloadImage {
  src: string;
  alt: string;
  options?: PreloadImageOptions;
}

/**
 * Hook for preloading critical images to improve Core Web Vitals
 */
export function useImagePreloader() {
  const preloadImage = useCallback((src: string, options: PreloadImageOptions = {}) => {
    if (typeof window === 'undefined') return;

    // Check if already preloaded
    const existingLink = document.querySelector(`link[href="${src}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;

    // Add crossorigin for better caching
    link.crossOrigin = 'anonymous';

    // Add to head
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const preloadImages = useCallback(
    (images: PreloadImage[]) => {
      const cleanupFunctions: (() => void)[] = [];

      images.forEach(({ src, options }) => {
        const cleanup = preloadImage(src, options);
        if (cleanup) {
          cleanupFunctions.push(cleanup);
        }
      });

      return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    },
    [preloadImage]
  );

  const preloadCriticalImages = useCallback(() => {
    // Define critical images that should be preloaded
    const criticalImages: PreloadImage[] = [
      // Add any logo or hero images here when they exist
      // Example:
      // { src: '/images/logo.svg', alt: 'AI Cover Letter Generator Logo', options: { priority: true } },
      // { src: '/images/hero-bg.webp', alt: 'Hero background', options: { priority: true, format: 'webp' } },
    ];

    return preloadImages(criticalImages);
  }, [preloadImages]);

  return {
    preloadImage,
    preloadImages,
    preloadCriticalImages,
  };
}

/**
 * Hook for preloading images on page load
 */
export function usePreloadCriticalImages() {
  const { preloadCriticalImages } = useImagePreloader();

  useEffect(() => {
    const cleanup = preloadCriticalImages();
    return cleanup;
  }, [preloadCriticalImages]);
}

/**
 * Hook for lazy loading images with intersection observer
 */
export function useLazyImageLoading() {
  const setupLazyLoading = useCallback((element: HTMLImageElement, src: string) => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      element.src = src;
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = src;
            img.classList.remove('opacity-0');
            img.classList.add('opacity-100');
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  return { setupLazyLoading };
}

/**
 * Hook for monitoring image loading performance
 */
export function useImagePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        const resourceEntry = entry as PerformanceResourceTiming;

        // Monitor image loading performance
        if (resourceEntry.initiatorType === 'img' || resourceEntry.name.includes('/_next/image')) {
          const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;

          // Log slow image loads (> 1 second)
          if (loadTime > 1000) {
            console.warn('Slow image load detected:', {
              url: resourceEntry.name,
              loadTime: Math.round(loadTime),
              size: resourceEntry.transferSize,
            });
          }

          // Track Largest Contentful Paint for images
          if (resourceEntry.name.includes('hero') || resourceEntry.name.includes('banner')) {
            console.info('Critical image loaded:', {
              url: resourceEntry.name,
              loadTime: Math.round(loadTime),
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }, []);
}
