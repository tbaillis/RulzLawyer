// code-repository/src/epic/epic-level-performance-monitor.js
class EpicLevelPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = new Map();
    this.alerts = [];
    this.performanceHistory = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('📈 Initializing Epic Level Performance Monitor...');
    const startTime = performance.now();

    try {
      await this.setupDefaultThresholds();
      await this.initializeMetrics();

      const initTime = performance.now() - startTime;
      console.log(`✅ Epic Level Performance Monitor initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Epic Level Performance Monitor initialization failed:', error);
      throw new EpicLevelPerformanceMonitorError(error.message);
    }
  }

  async setupDefaultThresholds() {
    // Performance thresholds for epic systems
    const thresholds = {
      xpCalculationTime: { warning: 10, critical: 50 }, // ms
      featValidationTime: { warning: 5, critical: 20 }, // ms
      divineAscensionTime: { warning: 100, critical: 500 }, // ms
      cosmicPowerUsageTime: { warning: 1, critical: 5 }, // ms
      abilityIncreaseTime: { warning: 2, critical: 10 }, // ms
      spellDatabaseQueryTime: { warning: 15, critical: 75 }, // ms
      progressionUpdateTime: { warning: 25, critical: 100 }, // ms
      memoryUsage: { warning: 50, critical: 100 }, // MB
      cpuUsage: { warning: 70, critical: 90 }, // %
      databaseQueryCount: { warning: 100, critical: 500 }, // queries per minute
      errorRate: { warning: 5, critical: 15 } // errors per minute
    };

    for (const [metric, threshold] of Object.entries(thresholds)) {
      this.thresholds.set(metric, threshold);
    }

    console.log('⚙️ Set up performance thresholds');
  }

  async initializeMetrics() {
    // Initialize metric tracking
    const metrics = [
      'xpCalculationTime',
      'featValidationTime',
      'divineAscensionTime',
      'cosmicPowerUsageTime',
      'abilityIncreaseTime',
      'spellDatabaseQueryTime',
      'progressionUpdateTime',
      'memoryUsage',
      'cpuUsage',
      'databaseQueryCount',
      'errorRate',
      'totalOperations',
      'successfulOperations',
      'failedOperations'
    ];

    for (const metric of metrics) {
      this.metrics.set(metric, {
        current: 0,
        average: 0,
        min: Infinity,
        max: 0,
        count: 0,
        history: [],
        lastUpdated: new Date().toISOString()
      });
    }

    console.log('📊 Initialized performance metrics tracking');
  }

  // Public API methods
  async recordMetric(metricName, value, context = {}) {
    if (!this.metrics.has(metricName)) {
      console.warn(`⚠️ Unknown metric: ${metricName}`);
      return;
    }

    const metric = this.metrics.get(metricName);
    const timestamp = new Date().toISOString();

    // Update current value
    metric.current = value;
    metric.lastUpdated = timestamp;

    // Update statistics
    metric.count++;
    metric.min = Math.min(metric.min, value);
    metric.max = Math.max(metric.max, value);
    metric.average = ((metric.average * (metric.count - 1)) + value) / metric.count;

    // Add to history (keep last 100 entries)
    metric.history.push({ value, timestamp, context });
    if (metric.history.length > 100) {
      metric.history.shift();
    }

    // Check thresholds and generate alerts
    await this.checkThresholds(metricName, value, context);

    return metric;
  }

  async checkThresholds(metricName, value, context) {
    const thresholds = this.thresholds.get(metricName);
    if (!thresholds) return;

    let alertLevel = null;
    let alertMessage = '';

    if (value >= thresholds.critical) {
      alertLevel = 'critical';
      alertMessage = `${metricName} exceeded critical threshold: ${value} (threshold: ${thresholds.critical})`;
    } else if (value >= thresholds.warning) {
      alertLevel = 'warning';
      alertMessage = `${metricName} exceeded warning threshold: ${value} (threshold: ${thresholds.warning})`;
    }

    if (alertLevel) {
      const alert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        level: alertLevel,
        metric: metricName,
        value,
        threshold: thresholds[alertLevel],
        message: alertMessage,
        context
      };

      this.alerts.push(alert);

      // Keep only last 50 alerts
      if (this.alerts.length > 50) {
        this.alerts.shift();
      }

      console.log(`🚨 ${alertLevel.toUpperCase()}: ${alertMessage}`);
    }
  }

  async startOperation(operationName, context = {}) {
    const startTime = performance.now();
    const operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const operation = {
      id: operationId,
      name: operationName,
      startTime,
      context,
      status: 'running'
    };

    // Store in performance history
    this.performanceHistory.push(operation);
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory.shift();
    }

    return operationId;
  }

  async endOperation(operationId, success = true, additionalMetrics = {}) {
    const operation = this.performanceHistory.find(op => op.id === operationId);
    if (!operation) {
      console.warn(`⚠️ Operation not found: ${operationId}`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - operation.startTime;

    operation.endTime = endTime;
    operation.duration = duration;
    operation.status = success ? 'completed' : 'failed';

    // Record duration metric
    const metricName = `${operation.name}Time`;
    await this.recordMetric(metricName, duration, { operationId, ...operation.context, ...additionalMetrics });

    // Update operation counters
    await this.recordMetric('totalOperations', (this.metrics.get('totalOperations').current || 0) + 1);
    if (success) {
      await this.recordMetric('successfulOperations', (this.metrics.get('successfulOperations').current || 0) + 1);
    } else {
      await this.recordMetric('failedOperations', (this.metrics.get('failedOperations').current || 0) + 1);
    }

    return operation;
  }

  async getMetricsSummary() {
    const summary = {};

    for (const [metricName, metric] of this.metrics) {
      summary[metricName] = {
        current: metric.current,
        average: Math.round(metric.average * 100) / 100,
        min: metric.min === Infinity ? 0 : metric.min,
        max: metric.max,
        count: metric.count,
        lastUpdated: metric.lastUpdated
      };
    }

    return summary;
  }

  async getAlerts(level = null, limit = 10) {
    let filteredAlerts = this.alerts;

    if (level) {
      filteredAlerts = this.alerts.filter(alert => alert.level === level);
    }

    return filteredAlerts.slice(-limit);
  }

  async getPerformanceReport(timeRange = 3600000) { // Default 1 hour
    const now = Date.now();
    const cutoff = now - timeRange;

    const report = {
      timestamp: new Date().toISOString(),
      timeRange,
      metrics: await this.getMetricsSummary(),
      alerts: await this.getAlerts(null, 20),
      recentOperations: this.performanceHistory
        .filter(op => op.startTime >= cutoff)
        .slice(-50),
      systemHealth: await this.assessSystemHealth(),
      recommendations: await this.generateRecommendations()
    };

    return report;
  }

  async assessSystemHealth() {
    const metrics = await this.getMetricsSummary();
    const alerts = await this.getAlerts('critical', 5);

    let healthScore = 100;
    let issues = [];

    // Check critical alerts
    if (alerts.length > 0) {
      healthScore -= alerts.length * 10;
      issues.push(`${alerts.length} critical alerts in the last hour`);
    }

    // Check error rate
    if (metrics.errorRate && metrics.errorRate.average > 10) {
      healthScore -= 20;
      issues.push(`High error rate: ${metrics.errorRate.average}%`);
    }

    // Check response times
    const slowMetrics = ['xpCalculationTime', 'divineAscensionTime', 'spellDatabaseQueryTime'];
    for (const metric of slowMetrics) {
      if (metrics[metric] && metrics[metric].average > this.thresholds.get(metric)?.critical) {
        healthScore -= 15;
        issues.push(`Slow ${metric}: ${metrics[metric].average}ms average`);
      }
    }

    // Check memory usage
    if (metrics.memoryUsage && metrics.memoryUsage.current > 80) {
      healthScore -= 10;
      issues.push(`High memory usage: ${metrics.memoryUsage.current}MB`);
    }

    healthScore = Math.max(0, healthScore);

    return {
      score: healthScore,
      status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical',
      issues
    };
  }

  async generateRecommendations() {
    const recommendations = [];
    const metrics = await this.getMetricsSummary();

    // Performance recommendations
    if (metrics.xpCalculationTime && metrics.xpCalculationTime.average > 20) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'XP calculation is slow. Consider caching or optimizing the algorithm.',
        metric: 'xpCalculationTime',
        currentValue: metrics.xpCalculationTime.average
      });
    }

    if (metrics.memoryUsage && metrics.memoryUsage.current > 75) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: 'High memory usage detected. Consider implementing memory cleanup or increasing available memory.',
        metric: 'memoryUsage',
        currentValue: metrics.memoryUsage.current
      });
    }

    if (metrics.databaseQueryCount && metrics.databaseQueryCount.average > 200) {
      recommendations.push({
        type: 'database',
        priority: 'medium',
        message: 'High database query rate. Consider query optimization or caching.',
        metric: 'databaseQueryCount',
        currentValue: metrics.databaseQueryCount.average
      });
    }

    // Error handling recommendations
    if (metrics.errorRate && metrics.errorRate.average > 5) {
      recommendations.push({
        type: 'reliability',
        priority: 'high',
        message: 'High error rate detected. Review error handling and add more validation.',
        metric: 'errorRate',
        currentValue: metrics.errorRate.average
      });
    }

    return recommendations;
  }

  async resetMetrics() {
    console.log('🔄 Resetting performance metrics...');

    for (const [metricName, metric] of this.metrics) {
      metric.current = 0;
      metric.average = 0;
      metric.min = Infinity;
      metric.max = 0;
      metric.count = 0;
      metric.history = [];
      metric.lastUpdated = new Date().toISOString();
    }

    this.alerts = [];
    this.performanceHistory = [];

    console.log('✅ Performance metrics reset');
  }

  async exportPerformanceData() {
    const exportData = {
      metrics: Object.fromEntries(this.metrics),
      thresholds: Object.fromEntries(this.thresholds),
      alerts: this.alerts,
      performanceHistory: this.performanceHistory.slice(-500), // Last 500 operations
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }

  // Utility methods for monitoring specific epic systems
  async monitorEpicLevelEngine(operation, context = {}) {
    const operationId = await this.startOperation(`epicLevelEngine.${operation}`, context);
    return operationId;
  }

  async monitorFeatDatabase(operation, context = {}) {
    const operationId = await this.startOperation(`featDatabase.${operation}`, context);
    return operationId;
  }

  async monitorDivineAscension(operation, context = {}) {
    const operationId = await this.startOperation(`divineAscension.${operation}`, context);
    return operationId;
  }

  async monitorSpellDatabase(operation, context = {}) {
    const operationId = await this.startOperation(`spellDatabase.${operation}`, context);
    return operationId;
  }

  async monitorAbilityManager(operation, context = {}) {
    const operationId = await this.startOperation(`abilityManager.${operation}`, context);
    return operationId;
  }
}

// Error Classes
class EpicLevelPerformanceMonitorError extends Error {
  constructor(message) { super(message); this.name = 'EpicLevelPerformanceMonitorError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EpicLevelPerformanceMonitor;
} else if (typeof window !== 'undefined') {
  window.EpicLevelPerformanceMonitor = EpicLevelPerformanceMonitor;
}