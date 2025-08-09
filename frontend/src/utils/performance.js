// Performance monitoring and optimization utilities

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    });
  }
};

// Send metrics to analytics service
const sendToAnalytics = (metric) => {
  // In production, send to your analytics service
  console.log('Web Vital:', metric);
  
  // Example: Send to Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
};

// Performance observer for custom metrics
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Monitor long tasks
    this.observeLongTasks();
    
    // Monitor layout shifts
    this.observeLayoutShifts();
    
    // Monitor resource loading
    this.observeResources();
  }

  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', entry.duration, 'ms');
              this.recordMetric('longTask', {
                duration: entry.duration,
                startTime: entry.startTime,
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', observer);
      } catch (e) {
        console.warn('Long task observer not supported');
      }
    }
  }

  observeLayoutShifts() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              this.recordMetric('layoutShift', {
                value: entry.value,
                startTime: entry.startTime,
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('layout-shift', observer);
      } catch (e) {
        console.warn('Layout shift observer not supported');
      }
    }
  }

  observeResources() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 1000) {
              console.warn('Slow resource:', entry.name, entry.duration, 'ms');
              this.recordMetric('slowResource', {
                name: entry.name,
                duration: entry.duration,
                size: entry.transferSize,
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', observer);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }

  recordMetric(name, data) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push({
      ...data,
      timestamp: Date.now(),
    });

    // Keep only last 100 entries per metric
    const entries = this.metrics.get(name);
    if (entries.length > 100) {
      entries.splice(0, entries.length - 100);
    }
  }

  getMetrics(name) {
    return this.metrics.get(name) || [];
  }

  getAllMetrics() {
    const result = {};
    for (const [name, entries] of this.metrics) {
      result[name] = entries;
    }
    return result;
  }

  disconnect() {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
  }
}

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const resources = [...scripts, ...styles].map(element => ({
    url: element.src || element.href,
    type: element.tagName.toLowerCase(),
  }));

  // Use Resource Timing API to get actual sizes
  const resourceEntries = performance.getEntriesByType('resource');
  
  const bundleInfo = resources.map(resource => {
    const entry = resourceEntries.find(e => e.name === resource.url);
    return {
      ...resource,
      size: entry ? entry.transferSize : 0,
      loadTime: entry ? entry.duration : 0,
    };
  });

  console.table(bundleInfo);
  return bundleInfo;
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !performance.memory) return null;

  const memory = performance.memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
    usage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100), // %
  };
};

// Network quality detection
export const detectNetworkQuality = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return { quality: 'unknown' };
  }

  const connection = navigator.connection;
  const effectiveType = connection.effectiveType;
  const downlink = connection.downlink;
  const rtt = connection.rtt;

  let quality = 'good';
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    quality = 'poor';
  } else if (effectiveType === '3g' || downlink < 1.5) {
    quality = 'moderate';
  } else if (rtt > 300) {
    quality = 'moderate';
  }

  return {
    quality,
    effectiveType,
    downlink,
    rtt,
    saveData: connection.saveData,
  };
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  const budgets = {
    firstContentfulPaint: 1500, // ms
    largestContentfulPaint: 2500, // ms
    cumulativeLayoutShift: 0.1,
    firstInputDelay: 100, // ms
    totalBlockingTime: 200, // ms
  };

  const results = {};
  
  // Check FCP
  const fcpEntries = performance.getEntriesByName('first-contentful-paint');
  if (fcpEntries.length > 0) {
    const fcp = fcpEntries[0].startTime;
    results.firstContentfulPaint = {
      value: fcp,
      budget: budgets.firstContentfulPaint,
      passed: fcp <= budgets.firstContentfulPaint,
    };
  }

  // Check LCP (requires web-vitals library)
  // This would be populated by the web-vitals tracking

  return results;
};

// Lazy loading performance
export const trackLazyLoading = (elementSelector) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const elements = document.querySelectorAll(elementSelector);
  const loadTimes = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const startTime = performance.now();
        loadTimes.set(entry.target, startTime);
        
        // Track when element finishes loading
        if (entry.target.tagName === 'IMG') {
          entry.target.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            console.log(`Lazy loaded image in ${loadTime.toFixed(2)}ms`);
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  });

  elements.forEach(element => observer.observe(element));
  
  return observer;
};

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize performance tracking
export const initPerformanceTracking = () => {
  trackWebVitals();
  
  // Log initial performance metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('Memory usage:', monitorMemoryUsage());
      console.log('Network quality:', detectNetworkQuality());
      console.log('Performance budget:', checkPerformanceBudget());
    }, 1000);
  });
};

// Export for use in React components
export default {
  trackWebVitals,
  PerformanceMonitor,
  performanceMonitor,
  analyzeBundleSize,
  monitorMemoryUsage,
  detectNetworkQuality,
  checkPerformanceBudget,
  trackLazyLoading,
  initPerformanceTracking,
};