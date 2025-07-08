// Image optimization utilities for better performance
import React from 'react';
import { logger } from './logging';

// Image optimization configuration
export interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'auto';
  sizes: number[];
  placeholder: 'blur' | 'empty';
  priority: boolean;
  loading: 'lazy' | 'eager';
}

// Default optimization settings
const DEFAULT_CONFIG: ImageOptimizationConfig = {
  quality: 85,
  format: 'auto',
  sizes: [640, 750, 828, 1080, 1200, 1920],
  placeholder: 'blur',
  priority: false,
  loading: 'lazy',
};

// Image format detection
export function getOptimalImageFormat(userAgent?: string): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined' && !userAgent) {
    return 'webp'; // Default for SSR
  }

  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  // Check for AVIF support
  if (ua.includes('Chrome/') && parseInt(ua.split('Chrome/')[1]) >= 85) {
    return 'avif';
  }

  // Check for WebP support
  if (
    ua.includes('Chrome/') ||
    ua.includes('Firefox/') ||
    ua.includes('Safari/') ||
    ua.includes('Edge/')
  ) {
    return 'webp';
  }

  return 'jpeg';
}

// Generate responsive image sizes
export function generateImageSizes(
  baseWidth: number,
  aspectRatio: number = 16 / 9,
  breakpoints: number[] = [640, 768, 1024, 1280, 1536]
): Array<{ width: number; height: number; breakpoint: string }> {
  return breakpoints.map(bp => ({
    width: Math.min(baseWidth, bp),
    height: Math.round(Math.min(baseWidth, bp) / aspectRatio),
    breakpoint: `${bp}px`,
  }));
}

// Generate srcSet for responsive images
export function generateSrcSet(
  src: string,
  sizes: Array<{ width: number; height: number }>,
  format: string = 'webp'
): string {
  return sizes
    .map(size => {
      const params = new URLSearchParams({
        url: src,
        w: size.width.toString(),
        h: size.height.toString(),
        f: format,
        q: '85',
      });
      return `/_next/image?${params} ${size.width}w`;
    })
    .join(', ');
}

// Generate sizes attribute for responsive images
export function generateSizesAttribute(
  breakpoints: Array<{ breakpoint: string; width: string }>
): string {
  const sizeQueries = breakpoints.map(bp => `(max-width: ${bp.breakpoint}) ${bp.width}`);
  return sizeQueries.join(', ');
}

// Image preloader for critical images
export class ImagePreloader {
  private preloadedImages = new Set<string>();

  preload(src: string, options: Partial<ImageOptimizationConfig> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();

      img.onload = () => {
        this.preloadedImages.add(src);
        logger.debug('Image preloaded successfully', { src });
        resolve();
      };

      img.onerror = error => {
        logger.error('Image preload failed', { src, error: error as unknown as Error });
        reject(error as unknown as Error);
      };

      // Set optimal format
      const format = getOptimalImageFormat();
      const params = new URLSearchParams({
        url: src,
        f: format,
        q: options.quality?.toString() || '85',
      });

      img.src = `/_next/image?${params}`;
    });
  }

  preloadMultiple(
    sources: string[],
    options: Partial<ImageOptimizationConfig> = {}
  ): Promise<void[]> {
    return Promise.all(sources.map(src => this.preload(src, options)));
  }

  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  clear(): void {
    this.preloadedImages.clear();
  }
}

// Lazy loading intersection observer
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private imageQueue = new Map<Element, () => void>();

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      });
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const loadCallback = this.imageQueue.get(entry.target);
        if (loadCallback) {
          loadCallback();
          this.imageQueue.delete(entry.target);
          this.observer?.unobserve(entry.target);
        }
      }
    });
  }

  observe(element: Element, loadCallback: () => void): void {
    if (!this.observer) {
      // Fallback: load immediately if IntersectionObserver is not supported
      loadCallback();
      return;
    }

    this.imageQueue.set(element, loadCallback);
    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    this.observer?.unobserve(element);
    this.imageQueue.delete(element);
  }

  disconnect(): void {
    this.observer?.disconnect();
    this.imageQueue.clear();
  }
}

// Image optimization utilities
export class ImageOptimizer {
  private preloader = new ImagePreloader();
  private lazyLoader = new LazyImageLoader();

  // Generate optimized image props for Next.js Image component
  generateImageProps(
    src: string,
    alt: string,
    width: number,
    height: number,
    config: Partial<ImageOptimizationConfig> = {}
  ) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const aspectRatio = width / height;

    // Generate responsive sizes
    const responsiveSizes = generateImageSizes(width, aspectRatio);
    const srcSet = generateSrcSet(src, responsiveSizes, finalConfig.format);

    const sizesAttribute = generateSizesAttribute([
      { breakpoint: '640px', width: '100vw' },
      { breakpoint: '768px', width: '50vw' },
      { breakpoint: '1024px', width: '33vw' },
      { breakpoint: '1280px', width: '25vw' },
    ]);

    return {
      src,
      alt,
      width,
      height,
      quality: finalConfig.quality,
      priority: finalConfig.priority,
      loading: finalConfig.loading,
      placeholder: finalConfig.placeholder,
      sizes: sizesAttribute,
      style: {
        width: '100%',
        height: 'auto',
      },
    };
  }

  // Preload critical images
  async preloadCriticalImages(
    images: Array<{ src: string; config?: Partial<ImageOptimizationConfig> }>
  ): Promise<void> {
    const preloadPromises = images.map(({ src, config }) => this.preloader.preload(src, config));

    try {
      await Promise.all(preloadPromises);
      logger.info('Critical images preloaded', { count: images.length });
    } catch (error) {
      logger.error('Failed to preload some critical images', { error: error as Error });
    }
  }

  // Setup lazy loading for an image element
  setupLazyLoading(element: Element, loadCallback: () => void): void {
    this.lazyLoader.observe(element, loadCallback);
  }

  // Cleanup resources
  cleanup(): void {
    this.preloader.clear();
    this.lazyLoader.disconnect();
  }
}

// React hook for image optimization
export function useImageOptimization() {
  const [optimizer] = React.useState(() => new ImageOptimizer());

  React.useEffect(() => {
    return () => {
      optimizer.cleanup();
    };
  }, [optimizer]);

  return {
    generateImageProps: optimizer.generateImageProps.bind(optimizer),
    preloadCriticalImages: optimizer.preloadCriticalImages.bind(optimizer),
    setupLazyLoading: optimizer.setupLazyLoading.bind(optimizer),
  };
}

// Image performance monitoring
export function monitorImagePerformance(): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver(list => {
    const entries = list.getEntries();

    entries.forEach(entry => {
      const resourceEntry = entry as PerformanceResourceTiming;

      if (resourceEntry.initiatorType === 'img' || resourceEntry.name.includes('/_next/image')) {
        const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;

        // Log slow image loads
        if (loadTime > 1000) {
          logger.warn('Slow image load detected', {
            url: resourceEntry.name,
            loadTime: Math.round(loadTime),
            size: resourceEntry.transferSize,
          });
        }

        // Track image performance metrics
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'image_performance', {
            event_category: 'Performance',
            event_label: resourceEntry.name,
            value: Math.round(loadTime),
            custom_parameter_1: resourceEntry.transferSize,
          });
        }
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
}

// Create singleton instances
export const imageOptimizer = new ImageOptimizer();
export const imagePreloader = new ImagePreloader();

// Convenience functions
export const generateOptimizedImageProps = (
  src: string,
  alt: string,
  width: number,
  height: number,
  config?: Partial<ImageOptimizationConfig>
) => imageOptimizer.generateImageProps(src, alt, width, height, config);

export const preloadImage = (src: string, config?: Partial<ImageOptimizationConfig>) =>
  imagePreloader.preload(src, config);

export const preloadImages = (sources: string[], config?: Partial<ImageOptimizationConfig>) =>
  imagePreloader.preloadMultiple(sources, config);
