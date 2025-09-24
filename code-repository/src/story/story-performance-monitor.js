// code-repository/src/story/story-performance-monitor.js
class StoryPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = new Map();
    this.alerts = new Map();
    this.performanceHistory = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('📊 Initializing Story Performance Monitor...');
    const startTime = performance.now();

    try {
      await this.setupDefaultMetrics();
      await this.setupDefaultThresholds();
      await this.initializePerformanceHistory();

      const initTime = performance.now() - startTime;
      console.log(`✅ Story Performance Monitor initialized in ${initTime.toFixed(2)}ms`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Story Performance Monitor initialization failed:', error);
      throw new StoryPerformanceMonitorError(error.message);
    }
  }

  async setupDefaultMetrics() {
    // Core story performance metrics
    const metricsData = [
      {
        id: 'narrative_engagement',
        name: 'Narrative Engagement',
        description: 'How engaged players are with the story',
        type: 'engagement',
        unit: 'score',
        range: { min: 0, max: 100 }
      },
      {
        id: 'character_development_rate',
        name: 'Character Development Rate',
        description: 'Rate at which characters grow and change',
        type: 'development',
        unit: 'points_per_session',
        range: { min: 0, max: 50 }
      },
      {
        id: 'plot_complexity',
        name: 'Plot Complexity',
        description: 'Complexity of interwoven story elements',
        type: 'complexity',
        unit: 'complexity_score',
        range: { min: 0, max: 100 }
      },
      {
        id: 'player_choice_impact',
        name: 'Player Choice Impact',
        description: 'How much player decisions affect the story',
        type: 'interactivity',
        unit: 'impact_percentage',
        range: { min: 0, max: 100 }
      },
      {
        id: 'emotional_intensity',
        name: 'Emotional Intensity',
        description: 'Emotional impact of story events',
        type: 'emotional',
        unit: 'intensity_score',
        range: { min: 0, max: 100 }
      },
      {
        id: 'story_pacing',
        name: 'Story Pacing',
        description: 'Balance of action vs contemplation',
        type: 'pacing',
        unit: 'pace_score',
        range: { min: 0, max: 100 }
      },
      {
        id: 'narrative_consistency',
        name: 'Narrative Consistency',
        description: 'Internal consistency of the story world',
        type: 'consistency',
        unit: 'consistency_score',
        range: { min: 0, max: 100 }
      },
      {
        id: 'relationship_dynamics',
        name: 'Relationship Dynamics',
        description: 'Complexity and health of character relationships',
        type: 'social',
        unit: 'dynamics_score',
        range: { min: 0, max: 100 }
      }
    ];

    for (const metric of metricsData) {
      this.metrics.set(metric.id, metric);
    }

    console.log(`📈 Loaded ${this.metrics.size} performance metrics`);
  }

  async setupDefaultThresholds() {
    // Performance thresholds for alerts
    const thresholdsData = [
      {
        metricId: 'narrative_engagement',
        warning: 40,
        critical: 20,
        excellent: 80
      },
      {
        metricId: 'character_development_rate',
        warning: 5,
        critical: 2,
        excellent: 20
      },
      {
        metricId: 'plot_complexity',
        warning: 30,
        critical: 15,
        excellent: 70
      },
      {
        metricId: 'player_choice_impact',
        warning: 25,
        critical: 10,
        excellent: 75
      },
      {
        metricId: 'emotional_intensity',
        warning: 35,
        critical: 15,
        excellent: 80
      },
      {
        metricId: 'story_pacing',
        warning: 40,
        critical: 20,
        excellent: 75
      },
      {
        metricId: 'narrative_consistency',
        warning: 60,
        critical: 40,
        excellent: 90
      },
      {
        metricId: 'relationship_dynamics',
        warning: 35,
        critical: 15,
        excellent: 80
      }
    ];

    for (const threshold of thresholdsData) {
      this.thresholds.set(threshold.metricId, threshold);
    }

    console.log(`⚠️ Loaded ${this.thresholds.size} performance thresholds`);
  }

  async initializePerformanceHistory() {
    // Initialize history tracking for each metric
    for (const [metricId, metric] of this.metrics) {
      this.performanceHistory.set(metricId, {
        values: [],
        timestamps: [],
        averages: new Map(),
        trends: new Map()
      });
    }

    console.log(`📚 Initialized performance history tracking`);
  }

  // Public API methods
  async recordMetric(metricId, value, context = {}) {
    if (!this.metrics.has(metricId)) {
      throw new StoryPerformanceMonitorError(`Unknown metric: ${metricId}`);
    }

    const metric = this.metrics.get(metricId);
    const history = this.performanceHistory.get(metricId);

    // Validate value range
    if (value < metric.range.min || value > metric.range.max) {
      console.warn(`⚠️ Metric ${metricId} value ${value} outside valid range [${metric.range.min}, ${metric.range.max}]`);
    }

    // Record the value
    const timestamp = new Date();
    history.values.push(value);
    history.timestamps.push(timestamp);

    // Keep only last 1000 values to prevent memory issues
    if (history.values.length > 1000) {
      history.values.shift();
      history.timestamps.shift();
    }

    // Update averages
    await this.updateAverages(metricId);

    // Check thresholds and generate alerts
    await this.checkThresholds(metricId, value, context);

    // Update trends
    await this.updateTrends(metricId);

    console.log(`📊 Recorded ${metricId}: ${value} (${metric.unit})`);
  }

  async updateAverages(metricId) {
    const history = this.performanceHistory.get(metricId);
    const values = history.values;

    if (values.length === 0) return;

    // Calculate rolling averages
    const periods = [10, 50, 100, 500]; // Last N values

    for (const period of periods) {
      if (values.length >= period) {
        const recentValues = values.slice(-period);
        const average = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
        history.averages.set(period, average);
      }
    }
  }

  async checkThresholds(metricId, value, context) {
    const thresholds = this.thresholds.get(metricId);
    if (!thresholds) return;

    const alerts = [];

    if (value <= thresholds.critical) {
      alerts.push({
        level: 'critical',
        message: `${this.metrics.get(metricId).name} critically low: ${value}`,
        recommendation: await this.generateRecommendation(metricId, 'critical', context)
      });
    } else if (value <= thresholds.warning) {
      alerts.push({
        level: 'warning',
        message: `${this.metrics.get(metricId).name} below recommended level: ${value}`,
        recommendation: await this.generateRecommendation(metricId, 'warning', context)
      });
    } else if (value >= thresholds.excellent) {
      alerts.push({
        level: 'excellent',
        message: `${this.metrics.get(metricId).name} performing excellently: ${value}`,
        recommendation: 'Continue current approach'
      });
    }

    // Store alerts
    for (const alert of alerts) {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.alerts.set(alertId, {
        ...alert,
        metricId,
        value,
        timestamp: new Date(),
        context
      });

      console.log(`🚨 ${alert.level.toUpperCase()}: ${alert.message}`);
    }
  }

  async generateRecommendation(metricId, severity, context) {
    const recommendations = {
      narrative_engagement: {
        critical: 'Introduce more compelling plot hooks and character-driven conflicts',
        warning: 'Add more meaningful player choices and emotional stakes'
      },
      character_development_rate: {
        critical: 'Focus on character growth through meaningful challenges and decisions',
        warning: 'Include more opportunities for character development and reflection'
      },
      plot_complexity: {
        critical: 'Simplify the plot and focus on core story elements',
        warning: 'Reduce the number of concurrent storylines'
      },
      player_choice_impact: {
        critical: 'Make player decisions have more significant consequences',
        warning: 'Increase the variety and impact of available choices'
      },
      emotional_intensity: {
        critical: 'Heighten emotional stakes through personal connections and sacrifices',
        warning: 'Add more emotionally charged moments and character relationships'
      },
      story_pacing: {
        critical: 'Balance action and downtime to maintain engagement',
        warning: 'Vary the pace between intense action and quiet reflection'
      },
      narrative_consistency: {
        critical: 'Review and fix plot holes and contradictory elements',
        warning: 'Ensure all story elements align with established lore'
      },
      relationship_dynamics: {
        critical: 'Develop character relationships through shared experiences',
        warning: 'Add more interpersonal conflicts and alliances'
      }
    };

    return recommendations[metricId]?.[severity] || 'Review and adjust story elements';
  }

  async updateTrends(metricId) {
    const history = this.performanceHistory.get(metricId);
    const values = history.values;

    if (values.length < 5) return; // Need minimum data for trends

    // Calculate trend over last 20 values
    const recentValues = values.slice(-20);
    const trend = this.calculateTrend(recentValues);

    history.trends.set('recent', {
      direction: trend > 0.5 ? 'improving' : trend < -0.5 ? 'declining' : 'stable',
      magnitude: Math.abs(trend),
      lastUpdated: new Date()
    });

    // Calculate long-term trend
    if (values.length >= 100) {
      const longTermValues = values.slice(-100);
      const longTermTrend = this.calculateTrend(longTermValues);

      history.trends.set('long_term', {
        direction: longTermTrend > 0.5 ? 'improving' : longTermTrend < -0.5 ? 'declining' : 'stable',
        magnitude: Math.abs(longTermTrend),
        lastUpdated: new Date()
      });
    }
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;

    // Simple linear trend calculation
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (val * index), 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  async getMetricSummary(metricId, timeRange = 'all') {
    if (!this.performanceHistory.has(metricId)) {
      return null;
    }

    const history = this.performanceHistory.get(metricId);
    const metric = this.metrics.get(metricId);

    let values = history.values;
    let timestamps = history.timestamps;

    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      const rangeMs = this.parseTimeRange(timeRange);
      const cutoff = new Date(now.getTime() - rangeMs);

      const filteredIndices = timestamps
        .map((ts, index) => ({ ts, index }))
        .filter(item => item.ts >= cutoff)
        .map(item => item.index);

      values = filteredIndices.map(i => values[i]);
      timestamps = filteredIndices.map(i => timestamps[i]);
    }

    if (values.length === 0) {
      return {
        metricId,
        name: metric.name,
        unit: metric.unit,
        dataPoints: 0,
        message: 'No data available for the specified time range'
      };
    }

    const summary = {
      metricId,
      name: metric.name,
      unit: metric.unit,
      dataPoints: values.length,
      current: values[values.length - 1],
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      minimum: Math.min(...values),
      maximum: Math.max(...values),
      trend: history.trends.get('recent') || { direction: 'unknown', magnitude: 0 },
      averages: Object.fromEntries(history.averages)
    };

    return summary;
  }

  parseTimeRange(range) {
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return ranges[range] || 0;
  }

  async getAllMetricsSummary(timeRange = '24h') {
    const summaries = {};

    for (const metricId of this.metrics.keys()) {
      summaries[metricId] = await this.getMetricSummary(metricId, timeRange);
    }

    return summaries;
  }

  async getActiveAlerts() {
    const activeAlerts = Array.from(this.alerts.values())
      .filter(alert => {
        // Consider alerts active for 24 hours
        const age = new Date() - alert.timestamp;
        return age < 24 * 60 * 60 * 1000;
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    return activeAlerts;
  }

  async assessSystemHealth() {
    const metrics = await this.getAllMetricsSummary('24h');
    const alerts = await this.getActiveAlerts();

    const health = {
      overall: 'healthy',
      score: 100,
      issues: [],
      recommendations: [],
      timestamp: new Date()
    };

    // Calculate health score based on metrics and alerts
    let totalScore = 0;
    let metricCount = 0;

    for (const [metricId, summary] of Object.entries(metrics)) {
      if (summary && summary.dataPoints > 0) {
        const thresholds = this.thresholds.get(metricId);
        const current = summary.current;

        let metricScore = 50; // Neutral score

        if (thresholds) {
          if (current >= thresholds.excellent) {
            metricScore = 100;
          } else if (current >= thresholds.warning) {
            metricScore = 75;
          } else if (current >= thresholds.critical) {
            metricScore = 25;
          } else {
            metricScore = 0;
          }
        }

        totalScore += metricScore;
        metricCount++;

        // Add issues for low scores
        if (metricScore < 50) {
          health.issues.push({
            metric: summary.name,
            severity: metricScore < 25 ? 'critical' : 'warning',
            current: current,
            threshold: thresholds?.warning || 'unknown'
          });
        }
      }
    }

    if (metricCount > 0) {
      health.score = Math.round(totalScore / metricCount);
    }

    // Factor in alerts
    const criticalAlerts = alerts.filter(a => a.level === 'critical').length;
    const warningAlerts = alerts.filter(a => a.level === 'warning').length;

    health.score -= (criticalAlerts * 20) + (warningAlerts * 5);
    health.score = Math.max(0, health.score);

    // Determine overall health
    if (health.score >= 80) {
      health.overall = 'excellent';
    } else if (health.score >= 60) {
      health.overall = 'healthy';
    } else if (health.score >= 40) {
      health.overall = 'concerning';
    } else if (health.score >= 20) {
      health.overall = 'unhealthy';
    } else {
      health.overall = 'critical';
    }

    // Generate recommendations
    if (health.issues.length > 0) {
      health.recommendations = health.issues.map(issue =>
        `Address ${issue.metric} - currently ${issue.current} (recommended: >${issue.threshold})`
      );
    }

    return health;
  }

  async generatePerformanceReport(timeRange = '7d') {
    const metrics = await this.getAllMetricsSummary(timeRange);
    const alerts = await this.getActiveAlerts();
    const health = await this.assessSystemHealth();

    const report = {
      generatedAt: new Date(),
      timeRange,
      health,
      metrics,
      alerts: alerts.slice(0, 10), // Last 10 alerts
      insights: await this.generateInsights(metrics, health),
      recommendations: await this.generateRecommendations(health, alerts)
    };

    return report;
  }

  async generateInsights(metrics, health) {
    const insights = [];

    // Analyze trends
    for (const [metricId, summary] of Object.entries(metrics)) {
      if (summary && summary.trend) {
        const trend = summary.trend;
        if (trend.direction === 'improving' && trend.magnitude > 1) {
          insights.push(`${summary.name} is showing strong improvement (+${trend.magnitude.toFixed(1)})`);
        } else if (trend.direction === 'declining' && trend.magnitude > 1) {
          insights.push(`${summary.name} is declining (-${trend.magnitude.toFixed(1)})`);
        }
      }
    }

    // Analyze correlations
    const engagement = metrics.narrative_engagement?.current || 0;
    const development = metrics.character_development_rate?.current || 0;

    if (engagement > 70 && development > 15) {
      insights.push('High engagement correlates with strong character development');
    } else if (engagement < 30 && development < 5) {
      insights.push('Low engagement may be linked to slow character development');
    }

    return insights;
  }

  async generateRecommendations(health, alerts) {
    const recommendations = [];

    if (health.overall === 'critical' || health.overall === 'unhealthy') {
      recommendations.push('Immediate attention required - review core story elements');
    }

    if (alerts.some(a => a.level === 'critical')) {
      recommendations.push('Address critical alerts immediately to prevent story breakdown');
    }

    // Metric-specific recommendations
    const metrics = await this.getAllMetricsSummary('24h');
    for (const [metricId, summary] of Object.entries(metrics)) {
      if (summary && summary.current < 30) {
        const rec = await this.generateRecommendation(metricId, 'critical', {});
        recommendations.push(`${summary.name}: ${rec}`);
      }
    }

    return recommendations;
  }

  async exportPerformanceData() {
    const exportData = {
      metrics: Object.fromEntries(this.metrics),
      thresholds: Object.fromEntries(this.thresholds),
      performanceHistory: Object.fromEntries(this.performanceHistory),
      alerts: Object.fromEntries(this.alerts),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }

  // Utility methods
  async resetMetrics() {
    console.log('🔄 Resetting all performance metrics...');
    this.performanceHistory.clear();
    this.alerts.clear();
    await this.initializePerformanceHistory();
    console.log('✅ Performance metrics reset');
  }

  async getMetricConfig(metricId) {
    return this.metrics.get(metricId) || null;
  }

  async updateThreshold(metricId, newThresholds) {
    if (!this.thresholds.has(metricId)) {
      throw new StoryPerformanceMonitorError(`No thresholds found for metric: ${metricId}`);
    }

    const current = this.thresholds.get(metricId);
    this.thresholds.set(metricId, { ...current, ...newThresholds });

    console.log(`⚙️ Updated thresholds for ${metricId}`);
  }
}

// Error Classes
class StoryPerformanceMonitorError extends Error {
  constructor(message) { super(message); this.name = 'StoryPerformanceMonitorError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoryPerformanceMonitor;
} else if (typeof window !== 'undefined') {
  window.StoryPerformanceMonitor = StoryPerformanceMonitor;
}