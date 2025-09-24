// code-repository/src/portrait/performance-monitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = new Map();
    this.alerts = [];
    this.initialized = false;
    this.maxMetricsHistory = 1000;
  }

  async initialize() {
    if (this.initialized) return;

    // Set up default performance thresholds
    this.setupDefaultThresholds();

    // Start performance monitoring
    this.startMonitoring();

    this.initialized = true;
    console.log('✅ PerformanceMonitor initialized successfully');
  }

  setupDefaultThresholds() {
    this.thresholds.set('portrait-generation-time', { warning: 100, critical: 500 }); // ms
    this.thresholds.set('portrait-update-time', { warning: 50, critical: 200 }); // ms
    this.thresholds.set('memory-usage', { warning: 50 * 1024 * 1024, critical: 100 * 1024 * 1024 }); // 50MB, 100MB
    this.thresholds.set('render-queue-length', { warning: 5, critical: 10 });
    this.thresholds.set('cache-hit-rate', { warning: 0.7, critical: 0.5 }); // 70%, 50%
  }

  startMonitoring() {
    // Monitor memory usage
    if (typeof performance !== 'undefined' && performance.memory) {
      setInterval(() => {
        this.recordMemoryUsage();
      }, 5000); // Every 5 seconds
    }

    // Monitor frame rate if in browser
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      this.monitorFrameRate();
    }
  }

  recordPortraitGeneration(time) {
    this.recordMetric('portrait-generation-time', time);
    this.checkThreshold('portrait-generation-time', time);
  }

  recordPortraitUpdate(time) {
    this.recordMetric('portrait-update-time', time);
    this.checkThreshold('portrait-update-time', time);
  }

  recordMemoryUsage() {
    if (typeof performance !== 'undefined' && performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize;
      this.recordMetric('memory-usage', memoryUsage);
      this.checkThreshold('memory-usage', memoryUsage);
    }
  }

  recordRenderQueueLength(length) {
    this.recordMetric('render-queue-length', length);
    this.checkThreshold('render-queue-length', length);
  }

  recordCacheHitRate(hitRate) {
    this.recordMetric('cache-hit-rate', hitRate);
    this.checkThreshold('cache-hit-rate', hitRate);
  }

  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricHistory = this.metrics.get(name);
    metricHistory.push({
      timestamp: Date.now(),
      value: value
    });

    // Maintain history size limit
    if (metricHistory.length > this.maxMetricsHistory) {
      metricHistory.shift();
    }
  }

  checkThreshold(metricName, value) {
    const threshold = this.thresholds.get(metricName);
    if (!threshold) return;

    let level = null;
    if (value >= threshold.critical) {
      level = 'critical';
    } else if (value >= threshold.warning) {
      level = 'warning';
    }

    if (level) {
      const alert = {
        timestamp: Date.now(),
        metric: metricName,
        level: level,
        value: value,
        threshold: threshold[level]
      };

      this.alerts.push(alert);
      this.handleAlert(alert);

      // Keep only recent alerts
      if (this.alerts.length > 100) {
        this.alerts.shift();
      }
    }
  }

  handleAlert(alert) {
    const message = `Performance Alert: ${alert.level.toUpperCase()} - ${alert.metric} is ${alert.value} (threshold: ${alert.threshold})`;

    switch (alert.level) {
      case 'warning':
        console.warn(`⚠️ ${message}`);
        break;
      case 'critical':
        console.error(`🚨 ${message}`);
        // Trigger performance optimization
        this.triggerOptimization(alert.metric);
        break;
    }
  }

  triggerOptimization(metricName) {
    switch (metricName) {
      case 'memory-usage':
        this.optimizeMemoryUsage();
        break;
      case 'render-queue-length':
        this.optimizeRenderQueue();
        break;
      case 'portrait-generation-time':
        this.optimizeGenerationPerformance();
        break;
      case 'cache-hit-rate':
        this.optimizeCachePerformance();
        break;
    }
  }

  optimizeMemoryUsage() {
    // Force garbage collection if available
    if (typeof window !== 'undefined' && window.gc) {
      window.gc();
    }

    // Clear old cache entries
    console.log('Optimizing memory usage...');
  }

  optimizeRenderQueue() {
    // Implement render queue optimization
    console.log('Optimizing render queue...');
  }

  optimizeGenerationPerformance() {
    // Implement generation performance optimization
    console.log('Optimizing portrait generation performance...');
  }

  optimizeCachePerformance() {
    // Implement cache performance optimization
    console.log('Optimizing cache performance...');
  }

  monitorFrameRate() {
    let lastTime = performance.now();
    let frameCount = 0;
    const fpsHistory = [];

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        fpsHistory.push(fps);

        // Keep only last 60 seconds of FPS data
        if (fpsHistory.length > 60) {
          fpsHistory.shift();
        }

        // Calculate average FPS
        const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;

        this.recordMetric('average-fps', avgFPS);

        // Check FPS threshold
        if (avgFPS < 30) {
          this.checkThreshold('average-fps', avgFPS);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  getMetricsSummary() {
    const summary = {};

    for (const [metricName, history] of this.metrics) {
      if (history.length === 0) continue;

      const values = history.map(h => h.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const latest = values[values.length - 1];

      summary[metricName] = {
        average: Math.round(avg * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        latest: Math.round(latest * 100) / 100,
        count: values.length
      };
    }

    return summary;
  }

  getAlerts(options = {}) {
    const { level, metric, since } = options;

    let filteredAlerts = [...this.alerts];

    if (level) {
      filteredAlerts = filteredAlerts.filter(alert => alert.level === level);
    }

    if (metric) {
      filteredAlerts = filteredAlerts.filter(alert => alert.metric === metric);
    }

    if (since) {
      const sinceTime = typeof since === 'number' ? since : new Date(since).getTime();
      filteredAlerts = filteredAlerts.filter(alert => alert.timestamp >= sinceTime);
    }

    return filteredAlerts;
  }

  clearAlerts() {
    this.alerts = [];
  }

  exportMetrics() {
    const summary = this.getMetricsSummary();
    const alerts = this.getAlerts();

    return {
      summary,
      alerts,
      exportedAt: new Date().toISOString(),
      thresholds: Object.fromEntries(this.thresholds)
    };
  }

  resetMetrics() {
    this.metrics.clear();
    this.alerts = [];
    console.log('Performance metrics reset');
  }

  setThreshold(metricName, warning, critical) {
    this.thresholds.set(metricName, { warning, critical });
  }

  getThreshold(metricName) {
    return this.thresholds.get(metricName);
  }

  // Performance profiling methods
  async profileFunction(func, ...args) {
    const startTime = performance.now();
    const startMemory = this.getCurrentMemoryUsage();

    try {
      const result = await func(...args);
      const endTime = performance.now();
      const endMemory = this.getCurrentMemoryUsage();

      const profile = {
        executionTime: endTime - startTime,
        memoryDelta: endMemory - startMemory,
        success: true
      };

      console.log(`Function profile: ${profile.executionTime.toFixed(2)}ms, ${profile.memoryDelta} bytes`);
      return { result, profile };

    } catch (error) {
      const endTime = performance.now();
      const endMemory = this.getCurrentMemoryUsage();

      const profile = {
        executionTime: endTime - startTime,
        memoryDelta: endMemory - startMemory,
        success: false,
        error: error.message
      };

      console.error(`Function profile failed: ${profile.executionTime.toFixed(2)}ms, error: ${error.message}`);
      throw error;
    }
  }

  getCurrentMemoryUsage() {
    if (typeof performance !== 'undefined' && performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  }

  // Performance recommendations
  getPerformanceRecommendations() {
    const summary = this.getMetricsSummary();
    const recommendations = [];

    // Memory usage recommendations
    if (summary['memory-usage'] && summary['memory-usage'].average > 50 * 1024 * 1024) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: 'High memory usage detected. Consider implementing cache size limits and periodic cleanup.'
      });
    }

    // Generation time recommendations
    if (summary['portrait-generation-time'] && summary['portrait-generation-time'].average > 200) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'Portrait generation is slow. Consider implementing caching and pre-rendering optimizations.'
      });
    }

    // Cache performance recommendations
    if (summary['cache-hit-rate'] && summary['cache-hit-rate'].average < 0.7) {
      recommendations.push({
        type: 'cache',
        priority: 'medium',
        message: 'Low cache hit rate. Consider adjusting cache strategy or increasing cache size.'
      });
    }

    return recommendations;
  }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
} else if (typeof window !== 'undefined') {
  window.PerformanceMonitor = PerformanceMonitor;
}