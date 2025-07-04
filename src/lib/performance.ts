// Performance monitoring utilities

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
  entries?: PerformanceEntry[];
}

// Performance measurement utility
export class PerformanceMonitor {
  private measurements = new Map<string, number>();
  private metrics: PerformanceMetrics[] = [];

  // Start measuring a performance mark
  start(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
    this.measurements.set(name, Date.now());
  }

  // End measuring and record the metric
  end(name: string): PerformanceMetrics | null {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`Performance measurement '${name}' was not started`);
      return null;
    }

    const duration = Date.now() - startTime;
    this.measurements.delete(name);

    let entries: PerformanceEntry[] = [];
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        entries = performance.getEntriesByName(name, 'measure');
      } catch (error) {
        console.warn('Performance API not fully supported:', error);
      }
    }

    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now(),
      entries,
    };

    this.metrics.push(metric);
    return metric;
  }

  // Get all recorded metrics
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Add a metric directly (for internal use)
  addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
  }

  // Get metrics by name
  getMetricsByName(name: string): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  // Clear all metrics
  clear(): void {
    this.metrics = [];
    this.measurements.clear();

    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.clearMarks();
        performance.clearMeasures();
      } catch (error) {
        console.warn('Could not clear performance marks:', error);
      }
    }
  }

  // Export metrics as JSON
  export(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Higher-order function to measure function execution time
export function measurePerformance<T extends (...args: unknown[]) => unknown>(
  name: string,
  fn: T
): T {
  return ((...args: Parameters<T>) => {
    performanceMonitor.start(name);
    try {
      const result = fn(...args);
      return result;
    } finally {
      performanceMonitor.end(name);
    }
  }) as T;
}

// Async version of measurePerformance
export function measureAsyncPerformance<T extends (...args: unknown[]) => Promise<unknown>>(
  name: string,
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    performanceMonitor.start(name);
    try {
      const result = await fn(...args);
      return result;
    } finally {
      performanceMonitor.end(name);
    }
  }) as T;
}

// Web Vitals monitoring
export interface WebVitalsMetric {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB';
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function measureWebVitals(onMetric: (metric: WebVitalsMetric) => void): void {
  if (typeof window === 'undefined') return;

  // Measure First Contentful Paint
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        onMetric({
          name: 'FCP',
          value: entry.startTime,
          delta: entry.startTime,
          id: 'fcp',
          rating:
            entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
        });
      }
    }
  });

  observer.observe({ type: 'paint', buffered: true });

  // Measure Largest Contentful Paint
  const lcpObserver = new PerformanceObserver(list => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      onMetric({
        name: 'LCP',
        value: lastEntry.startTime,
        delta: lastEntry.startTime,
        id: 'lcp',
        rating:
          lastEntry.startTime < 2500
            ? 'good'
            : lastEntry.startTime < 4000
              ? 'needs-improvement'
              : 'poor',
      });
    }
  });

  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

  // Measure Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (!(entry as LayoutShift).hadRecentInput) {
        clsValue += (entry as LayoutShift).value;
      }
    }

    onMetric({
      name: 'CLS',
      value: clsValue,
      delta: clsValue,
      id: 'cls',
      rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
    });
  });

  clsObserver.observe({ type: 'layout-shift', buffered: true });

  // Measure First Input Delay
  const fidObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      const fidEntry = entry as PerformanceEventTiming;
      const fidValue = fidEntry.processingStart - fidEntry.startTime;

      onMetric({
        name: 'FID',
        value: fidValue,
        delta: fidValue,
        id: 'fid',
        rating: fidValue < 100 ? 'good' : fidValue < 300 ? 'needs-improvement' : 'poor',
      });
    }
  });

  fidObserver.observe({ type: 'first-input', buffered: true });
}

// Resource loading performance
export function measureResourcePerformance(): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      const resourceEntry = entry as PerformanceResourceTiming;

      // Log slow resources (> 1 second)
      if (resourceEntry.duration > 1000) {
        console.warn(
          `Slow resource loading: ${resourceEntry.name} took ${Math.round(resourceEntry.duration)}ms`
        );

        performanceMonitor.addMetric({
          name: `resource-${resourceEntry.initiatorType}`,
          duration: resourceEntry.duration,
          timestamp: Date.now(),
          entries: [resourceEntry],
        });
      }
    }
  });

  observer.observe({ type: 'resource', buffered: true });
}

// Bundle size analyzer
export function analyzeBundleSize(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    const jsResources = resources.filter(r => r.initiatorType === 'script');
    const cssResources = resources.filter(r => r.initiatorType === 'link');
    const imageResources = resources.filter(r => r.initiatorType === 'img');

    const jsSize = jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
    const cssSize = cssResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
    const imageSize = imageResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);

    console.group('Bundle Size Analysis');
    console.log(`JavaScript: ${(jsSize / 1024).toFixed(2)} KB`);
    console.log(`CSS: ${(cssSize / 1024).toFixed(2)} KB`);
    console.log(`Images: ${(imageSize / 1024).toFixed(2)} KB`);
    console.log(`Total: ${((jsSize + cssSize + imageSize) / 1024).toFixed(2)} KB`);
    console.groupEnd();
  });
}

// Performance budget checker
export interface PerformanceBudget {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  totalBundleSize?: number;
}

export function checkPerformanceBudget(budget: PerformanceBudget): void {
  measureWebVitals(metric => {
    let budgetValue: number | undefined;

    switch (metric.name) {
      case 'FCP':
        budgetValue = budget.firstContentfulPaint;
        break;
      case 'LCP':
        budgetValue = budget.largestContentfulPaint;
        break;
      case 'CLS':
        budgetValue = budget.cumulativeLayoutShift;
        break;
      case 'FID':
        budgetValue = budget.firstInputDelay;
        break;
    }

    if (budgetValue && metric.value > budgetValue) {
      console.warn(
        `Performance budget exceeded: ${metric.name} = ${metric.value}, budget = ${budgetValue}`
      );
    }
  });
}

// Type definitions for PerformanceObserver entries
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}
