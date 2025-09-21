/**
 * Performance Optimization Interface
 * User interface for performance monitoring, cache management, and optimization controls
 * 
 * Features:
 * - Real-time performance monitoring dashboard
 * - Cache management and visualization
 * - Memory usage tracking and optimization
 * - Background task monitoring
 * - Lazy loading statistics
 * - Service worker status
 * - Performance analytics and reports
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class PerformanceInterface {
    constructor(performanceManager, options = {}) {
        this.performanceManager = performanceManager;
        
        this.options = {
            showMonitoring: options.showMonitoring !== false,
            showCache: options.showCache !== false,
            showMemory: options.showMemory !== false,
            showTasks: options.showTasks !== false,
            showOptimization: options.showOptimization !== false,
            updateInterval: options.updateInterval || 2000,
            showAdvanced: options.showAdvanced || false,
            ...options
        };
        
        // Interface state
        this.isVisible = false;
        this.activeTab = 'overview';
        this.updateTimer = null;
        
        // UI elements
        this.modalElement = null;
        this.statusIndicator = null;
        
        // Performance data
        this.performanceHistory = [];
        this.maxHistoryLength = 100;
        
        // Charts and visualizations
        this.charts = new Map();
        
        this.initialize();
        
        console.log('⚡ Performance Interface initialized');
    }
    
    initialize() {
        this.createInterface();
        this.setupEventHandlers();
        this.setupPerformanceEvents();
        this.createStatusIndicator();
        
        // Start auto-update
        this.startAutoUpdate();
        
        console.log('⚡ Performance Interface ready');
    }
    
    createInterface() {
        // Create modal interface
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'performance-modal modal';
        this.modalElement.style.display = 'none';
        this.modalElement.innerHTML = this.generateModalHTML();
        
        document.body.appendChild(this.modalElement);
        
        console.log('⚡ Performance Interface created');
    }
    
    generateModalHTML() {
        return `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title-section">
                            <h5 class="modal-title">⚡ Performance Monitor</h5>
                            <div class="performance-status">
                                <span id="performance-status-text">Monitoring...</span>
                                <div id="performance-indicator" class="status-indicator good"></div>
                            </div>
                        </div>
                        <button type="button" class="modal-close" onclick="this.closest('.performance-modal').style.display='none'">×</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="performance-tabs">
                            <nav class="tab-navigation">
                                <button class="tab-btn active" data-tab="overview">📊 Overview</button>
                                <button class="tab-btn" data-tab="memory">🧠 Memory</button>
                                <button class="tab-btn" data-tab="cache">💾 Cache</button>
                                <button class="tab-btn" data-tab="tasks">⚙️ Tasks</button>
                                <button class="tab-btn" data-tab="optimization">🚀 Optimization</button>
                                <button class="tab-btn" data-tab="advanced">🔧 Advanced</button>
                            </nav>
                            
                            <div class="tab-content">
                                ${this.generateOverviewTabHTML()}
                                ${this.generateMemoryTabHTML()}
                                ${this.generateCacheTabHTML()}
                                ${this.generateTasksTabHTML()}
                                ${this.generateOptimizationTabHTML()}
                                ${this.generateAdvancedTabHTML()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="footer-info">
                            <span id="last-update">Last update: Never</span>
                        </div>
                        <div class="footer-actions">
                            <button id="optimize-now-btn" class="btn btn-primary">🚀 Optimize Now</button>
                            <button id="export-report-btn" class="btn btn-secondary">📄 Export Report</button>
                            <button class="btn btn-secondary" onclick="this.closest('.performance-modal').style.display='none'">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateOverviewTabHTML() {
        return `
            <div id="overview-tab" class="tab-panel active">
                <div class="performance-overview">
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <h3>⚡ Performance Score</h3>
                            <div class="metric-value" id="performance-score">--</div>
                            <div class="metric-change" id="performance-change">--</div>
                        </div>
                        
                        <div class="metric-card">
                            <h3>🧠 Memory Usage</h3>
                            <div class="metric-value" id="memory-usage">--</div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="memory-progress"></div>
                            </div>
                        </div>
                        
                        <div class="metric-card">
                            <h3>💾 Cache Hit Rate</h3>
                            <div class="metric-value" id="cache-hit-rate">--</div>
                            <div class="metric-subtitle" id="cache-entries">0 entries</div>
                        </div>
                        
                        <div class="metric-card">
                            <h3>⚙️ Background Tasks</h3>
                            <div class="metric-value" id="active-tasks">--</div>
                            <div class="metric-subtitle" id="task-queue">0 queued</div>
                        </div>
                        
                        <div class="metric-card">
                            <h3>🔄 Lazy Loading</h3>
                            <div class="metric-value" id="lazy-loaded">--</div>
                            <div class="metric-subtitle" id="lazy-pending">0 pending</div>
                        </div>
                        
                        <div class="metric-card">
                            <h3>📶 Network Status</h3>
                            <div class="metric-value" id="network-status">--</div>
                            <div class="metric-subtitle" id="service-worker">Service Worker</div>
                        </div>
                    </div>
                    
                    <div class="performance-chart-section">
                        <h3>Performance Timeline</h3>
                        <div class="chart-container">
                            <canvas id="performance-chart" width="800" height="200"></canvas>
                        </div>
                        <div class="chart-controls">
                            <button class="btn btn-sm" data-timespan="1m">1m</button>
                            <button class="btn btn-sm active" data-timespan="5m">5m</button>
                            <button class="btn btn-sm" data-timespan="15m">15m</button>
                            <button class="btn btn-sm" data-timespan="1h">1h</button>
                        </div>
                    </div>
                    
                    <div class="performance-alerts">
                        <h3>Performance Alerts</h3>
                        <div id="performance-alerts-list" class="alerts-list">
                            <div class="no-alerts">No performance issues detected</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateMemoryTabHTML() {
        return `
            <div id="memory-tab" class="tab-panel">
                <div class="memory-panel">
                    <div class="memory-overview">
                        <h3>Memory Overview</h3>
                        <div class="memory-stats-grid">
                            <div class="stat-item">
                                <label>Used Memory:</label>
                                <span id="memory-used">-- MB</span>
                            </div>
                            <div class="stat-item">
                                <label>Total Memory:</label>
                                <span id="memory-total">-- MB</span>
                            </div>
                            <div class="stat-item">
                                <label>Memory Limit:</label>
                                <span id="memory-limit">-- MB</span>
                            </div>
                            <div class="stat-item">
                                <label>Usage Percentage:</label>
                                <span id="memory-percentage">--%</span>
                            </div>
                        </div>
                        
                        <div class="memory-usage-chart">
                            <canvas id="memory-chart" width="600" height="300"></canvas>
                        </div>
                    </div>
                    
                    <div class="memory-breakdown">
                        <h3>Memory Breakdown</h3>
                        <div class="breakdown-list">
                            <div class="breakdown-item">
                                <span class="category">Character Data</span>
                                <span class="size" id="memory-characters">-- KB</span>
                                <div class="progress-mini">
                                    <div class="progress-fill-mini" style="width: 45%;"></div>
                                </div>
                            </div>
                            
                            <div class="breakdown-item">
                                <span class="category">Spell Data</span>
                                <span class="size" id="memory-spells">-- KB</span>
                                <div class="progress-mini">
                                    <div class="progress-fill-mini" style="width: 30%;"></div>
                                </div>
                            </div>
                            
                            <div class="breakdown-item">
                                <span class="category">Equipment Data</span>
                                <span class="size" id="memory-equipment">-- KB</span>
                                <div class="progress-mini">
                                    <div class="progress-fill-mini" style="width: 15%;"></div>
                                </div>
                            </div>
                            
                            <div class="breakdown-item">
                                <span class="category">Cache Data</span>
                                <span class="size" id="memory-cache">-- KB</span>
                                <div class="progress-mini">
                                    <div class="progress-fill-mini" style="width: 10%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="memory-actions">
                        <h3>Memory Management</h3>
                        <div class="action-buttons">
                            <button id="force-gc-btn" class="btn btn-warning">🗑️ Force Cleanup</button>
                            <button id="clear-cache-btn" class="btn btn-warning">💾 Clear Cache</button>
                            <button id="optimize-memory-btn" class="btn btn-primary">⚡ Optimize Memory</button>
                        </div>
                        
                        <div class="memory-settings">
                            <div class="setting-item">
                                <label for="memory-threshold">Memory Warning Threshold (%):</label>
                                <input type="range" id="memory-threshold" min="50" max="95" value="80">
                                <span id="memory-threshold-value">80%</span>
                            </div>
                            
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="auto-cleanup" checked>
                                    <span>Automatic cleanup when threshold reached</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateCacheTabHTML() {
        return `
            <div id="cache-tab" class="tab-panel">
                <div class="cache-panel">
                    <div class="cache-overview">
                        <h3>Cache Overview</h3>
                        <div class="cache-stats-grid">
                            <div class="cache-layer-card">
                                <h4>Memory Cache</h4>
                                <div class="cache-stats">
                                    <div>Entries: <span id="memory-cache-entries">0</span></div>
                                    <div>Size: <span id="memory-cache-size">0 KB</span></div>
                                    <div>Hit Rate: <span id="memory-cache-hit-rate">0%</span></div>
                                </div>
                                <button class="btn btn-sm btn-warning" onclick="performanceInterface?.clearCacheLayer('memory')">Clear</button>
                            </div>
                            
                            <div class="cache-layer-card">
                                <h4>Session Cache</h4>
                                <div class="cache-stats">
                                    <div>Entries: <span id="session-cache-entries">0</span></div>
                                    <div>Size: <span id="session-cache-size">0 KB</span></div>
                                    <div>Hit Rate: <span id="session-cache-hit-rate">0%</span></div>
                                </div>
                                <button class="btn btn-sm btn-warning" onclick="performanceInterface?.clearCacheLayer('session')">Clear</button>
                            </div>
                            
                            <div class="cache-layer-card">
                                <h4>Persistent Cache</h4>
                                <div class="cache-stats">
                                    <div>Entries: <span id="persistent-cache-entries">0</span></div>
                                    <div>Size: <span id="persistent-cache-size">0 KB</span></div>
                                    <div>Hit Rate: <span id="persistent-cache-hit-rate">0%</span></div>
                                </div>
                                <button class="btn btn-sm btn-warning" onclick="performanceInterface?.clearCacheLayer('persistent')">Clear</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cache-details">
                        <h3>Cache Details</h3>
                        <div class="cache-controls">
                            <select id="cache-layer-select" class="form-control">
                                <option value="memory">Memory Cache</option>
                                <option value="session">Session Cache</option>
                                <option value="persistent">Persistent Cache</option>
                            </select>
                            <input type="text" id="cache-search" class="form-control" placeholder="Search cache entries...">
                        </div>
                        
                        <div class="cache-table-container">
                            <table id="cache-table" class="cache-table">
                                <thead>
                                    <tr>
                                        <th>Key</th>
                                        <th>Size</th>
                                        <th>Hits</th>
                                        <th>Created</th>
                                        <th>TTL</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="cache-table-body">
                                    <tr><td colspan="6" class="no-data">No cache entries</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="cache-analytics">
                        <h3>Cache Performance</h3>
                        <div class="analytics-chart">
                            <canvas id="cache-performance-chart" width="600" height="200"></canvas>
                        </div>
                        
                        <div class="cache-settings">
                            <div class="setting-group">
                                <h4>Cache Settings</h4>
                                <div class="setting-item">
                                    <label for="cache-size-limit">Cache Size Limit (MB):</label>
                                    <input type="number" id="cache-size-limit" class="form-control" value="50" min="1" max="500">
                                </div>
                                
                                <div class="setting-item">
                                    <label for="default-ttl">Default TTL (minutes):</label>
                                    <input type="number" id="default-ttl" class="form-control" value="5" min="1" max="60">
                                </div>
                                
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="cache-compression" checked>
                                        <span>Enable compression</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateTasksTabHTML() {
        return `
            <div id="tasks-tab" class="tab-panel">
                <div class="tasks-panel">
                    <div class="tasks-overview">
                        <h3>Background Tasks</h3>
                        <div class="tasks-stats">
                            <div class="task-stat">
                                <label>Active Tasks:</label>
                                <span id="active-tasks-count">0</span>
                            </div>
                            <div class="task-stat">
                                <label>Completed:</label>
                                <span id="completed-tasks-count">0</span>
                            </div>
                            <div class="task-stat">
                                <label>Failed:</label>
                                <span id="failed-tasks-count">0</span>
                            </div>
                            <div class="task-stat">
                                <label>Worker Pool:</label>
                                <span id="worker-pool-size">0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="active-tasks-section">
                        <h3>Active Tasks</h3>
                        <div id="active-tasks-list" class="tasks-list">
                            <div class="no-tasks">No active tasks</div>
                        </div>
                    </div>
                    
                    <div class="task-history-section">
                        <h3>Task History</h3>
                        <div class="history-controls">
                            <select id="task-type-filter" class="form-control">
                                <option value="">All Types</option>
                                <option value="calculate-character-stats">Character Stats</option>
                                <option value="generate-random-tables">Random Tables</option>
                                <option value="process-spell-data">Spell Data</option>
                                <option value="validate-character">Validation</option>
                            </select>
                            <select id="task-status-filter" class="form-control">
                                <option value="">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        
                        <div id="task-history-list" class="tasks-list history-list">
                            <div class="no-tasks">No task history</div>
                        </div>
                    </div>
                    
                    <div class="task-performance">
                        <h3>Task Performance</h3>
                        <div class="performance-metrics">
                            <div class="metric-item">
                                <label>Average Duration:</label>
                                <span id="avg-task-duration">-- ms</span>
                            </div>
                            <div class="metric-item">
                                <label>Success Rate:</label>
                                <span id="task-success-rate">--%</span>
                            </div>
                            <div class="metric-item">
                                <label>Queue Time:</label>
                                <span id="avg-queue-time">-- ms</span>
                            </div>
                        </div>
                        
                        <div class="task-chart">
                            <canvas id="task-performance-chart" width="600" height="150"></canvas>
                        </div>
                    </div>
                    
                    <div class="worker-management">
                        <h3>Worker Management</h3>
                        <div class="worker-actions">
                            <button id="restart-workers-btn" class="btn btn-warning">🔄 Restart Workers</button>
                            <button id="add-worker-btn" class="btn btn-primary">➕ Add Worker</button>
                            <button id="test-workers-btn" class="btn btn-secondary">🧪 Test Workers</button>
                        </div>
                        
                        <div class="worker-settings">
                            <div class="setting-item">
                                <label for="max-workers">Maximum Workers:</label>
                                <input type="number" id="max-workers" class="form-control" value="4" min="1" max="8">
                            </div>
                            
                            <div class="setting-item">
                                <label for="task-timeout">Task Timeout (seconds):</label>
                                <input type="number" id="task-timeout" class="form-control" value="30" min="5" max="300">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateOptimizationTabHTML() {
        return `
            <div id="optimization-tab" class="tab-panel">
                <div class="optimization-panel">
                    <div class="optimization-overview">
                        <h3>Performance Optimization</h3>
                        <div class="optimization-score">
                            <div class="score-circle">
                                <canvas id="optimization-score-chart" width="150" height="150"></canvas>
                                <div class="score-text">
                                    <span id="optimization-score-value">--</span>
                                    <small>Score</small>
                                </div>
                            </div>
                            <div class="score-details">
                                <div class="score-item">
                                    <span class="label">Memory:</span>
                                    <span class="value" id="memory-score">--</span>
                                </div>
                                <div class="score-item">
                                    <span class="label">Cache:</span>
                                    <span class="value" id="cache-score">--</span>
                                </div>
                                <div class="score-item">
                                    <span class="label">Tasks:</span>
                                    <span class="value" id="tasks-score">--</span>
                                </div>
                                <div class="score-item">
                                    <span class="label">Loading:</span>
                                    <span class="value" id="loading-score">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="optimization-recommendations">
                        <h3>Optimization Recommendations</h3>
                        <div id="recommendations-list" class="recommendations-list">
                            <div class="recommendation-item">
                                <div class="recommendation-icon">💡</div>
                                <div class="recommendation-content">
                                    <h4>No recommendations at this time</h4>
                                    <p>Your application is running optimally.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="optimization-actions">
                        <h3>Quick Optimizations</h3>
                        <div class="optimization-buttons">
                            <button id="optimize-memory-btn" class="btn btn-primary">
                                🧠 Optimize Memory
                                <small>Clear unused data and optimize memory usage</small>
                            </button>
                            
                            <button id="optimize-cache-btn" class="btn btn-primary">
                                💾 Optimize Cache
                                <small>Clean up expired entries and optimize cache</small>
                            </button>
                            
                            <button id="optimize-tasks-btn" class="btn btn-primary">
                                ⚙️ Optimize Tasks
                                <small>Restart workers and optimize task processing</small>
                            </button>
                            
                            <button id="optimize-loading-btn" class="btn btn-primary">
                                🔄 Optimize Loading
                                <small>Preload critical resources and optimize lazy loading</small>
                            </button>
                        </div>
                        
                        <div class="bulk-optimization">
                            <button id="optimize-all-btn" class="btn btn-success btn-lg">
                                🚀 Optimize Everything
                                <small>Run all optimizations automatically</small>
                            </button>
                        </div>
                    </div>
                    
                    <div class="optimization-history">
                        <h3>Optimization History</h3>
                        <div id="optimization-history-list" class="history-list">
                            <div class="no-history">No optimization history</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateAdvancedTabHTML() {
        return `
            <div id="advanced-tab" class="tab-panel">
                <div class="advanced-panel">
                    <div class="advanced-settings">
                        <h3>Advanced Settings</h3>
                        <div class="settings-grid">
                            <div class="setting-group">
                                <h4>Performance Monitoring</h4>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="enable-monitoring" checked>
                                        <span>Enable performance monitoring</span>
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label for="monitoring-interval">Monitoring interval (ms):</label>
                                    <input type="number" id="monitoring-interval" class="form-control" value="2000" min="500" max="10000">
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="debug-mode">
                                        <span>Debug mode (verbose logging)</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="setting-group">
                                <h4>Lazy Loading</h4>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="enable-lazy-loading" checked>
                                        <span>Enable lazy loading</span>
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label for="lazy-threshold">Intersection threshold:</label>
                                    <input type="range" id="lazy-threshold" min="0" max="1" step="0.1" value="0.1">
                                    <span id="lazy-threshold-value">0.1</span>
                                </div>
                                <div class="setting-item">
                                    <label for="lazy-root-margin">Root margin (px):</label>
                                    <input type="number" id="lazy-root-margin" class="form-control" value="50" min="0" max="200">
                                </div>
                            </div>
                            
                            <div class="setting-group">
                                <h4>Service Worker</h4>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="enable-service-worker" checked>
                                        <span>Enable service worker</span>
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <div>Status: <span id="sw-status">Unknown</span></div>
                                    <div>Version: <span id="sw-version">--</span></div>
                                </div>
                                <div class="setting-item">
                                    <button id="update-sw-btn" class="btn btn-sm btn-secondary">Update Service Worker</button>
                                    <button id="unregister-sw-btn" class="btn btn-sm btn-warning">Unregister</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="diagnostic-tools">
                        <h3>Diagnostic Tools</h3>
                        <div class="diagnostic-buttons">
                            <button id="run-diagnostics-btn" class="btn btn-primary">🔍 Run Diagnostics</button>
                            <button id="performance-audit-btn" class="btn btn-secondary">📋 Performance Audit</button>
                            <button id="memory-snapshot-btn" class="btn btn-secondary">📸 Memory Snapshot</button>
                            <button id="export-logs-btn" class="btn btn-secondary">📄 Export Logs</button>
                        </div>
                        
                        <div id="diagnostic-results" class="diagnostic-results" style="display: none;">
                            <h4>Diagnostic Results</h4>
                            <div class="results-content">
                                <textarea id="diagnostic-output" readonly rows="15" class="form-control"></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div class="performance-testing">
                        <h3>Performance Testing</h3>
                        <div class="test-controls">
                            <select id="test-type" class="form-control">
                                <option value="memory">Memory Stress Test</option>
                                <option value="cache">Cache Performance Test</option>
                                <option value="tasks">Background Task Test</option>
                                <option value="loading">Lazy Loading Test</option>
                            </select>
                            <input type="number" id="test-duration" class="form-control" placeholder="Duration (seconds)" value="30">
                            <button id="start-test-btn" class="btn btn-warning">🧪 Start Test</button>
                            <button id="stop-test-btn" class="btn btn-danger" disabled>⏹️ Stop Test</button>
                        </div>
                        
                        <div id="test-progress" class="test-progress" style="display: none;">
                            <div class="progress-bar">
                                <div class="progress-fill" id="test-progress-bar"></div>
                            </div>
                            <div class="progress-text">
                                <span id="test-progress-text">Running test...</span>
                            </div>
                        </div>
                        
                        <div id="test-results" class="test-results" style="display: none;">
                            <h4>Test Results</h4>
                            <div class="results-summary">
                                <div class="result-item">
                                    <label>Test Duration:</label>
                                    <span id="result-duration">--</span>
                                </div>
                                <div class="result-item">
                                    <label>Operations:</label>
                                    <span id="result-operations">--</span>
                                </div>
                                <div class="result-item">
                                    <label>Average Time:</label>
                                    <span id="result-avg-time">--</span>
                                </div>
                                <div class="result-item">
                                    <label>Success Rate:</label>
                                    <span id="result-success-rate">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createStatusIndicator() {
        this.statusIndicator = document.createElement('div');
        this.statusIndicator.className = 'performance-status-indicator';
        this.statusIndicator.innerHTML = `
            <div class="status-icon" title="Performance status">
                <span id="perf-status-icon">⚡</span>
            </div>
            <div class="status-tooltip">
                <div class="tooltip-content">
                    <strong>Performance: <span id="tooltip-status">Good</span></strong>
                    <div>Memory: <span id="tooltip-memory">--</span></div>
                    <div>Cache: <span id="tooltip-cache">--</span></div>
                    <button class="btn btn-sm btn-primary" onclick="window.performanceInterface?.show()">Open Monitor</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.statusIndicator);
    }
    
    setupEventHandlers() {
        // Tab switching
        this.modalElement.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
        
        // Optimization actions
        const optimizeNowBtn = this.modalElement.querySelector('#optimize-now-btn');
        if (optimizeNowBtn) {
            optimizeNowBtn.addEventListener('click', () => this.optimizeNow());
        }
        
        const exportReportBtn = this.modalElement.querySelector('#export-report-btn');
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => this.exportReport());
        }
        
        // Memory management
        const forceGCBtn = this.modalElement.querySelector('#force-gc-btn');
        if (forceGCBtn) {
            forceGCBtn.addEventListener('click', () => this.forceGarbageCollection());
        }
        
        // Cache management
        const clearCacheBtn = this.modalElement.querySelector('#clear-cache-btn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => this.clearAllCache());
        }
        
        console.log('⚡ Event handlers setup complete');
    }
    
    setupPerformanceEvents() {
        // Listen to performance manager events
        this.performanceManager.on('performanceIssue', (data) => {
            this.addPerformanceAlert(data);
        });
        
        this.performanceManager.on('memoryWarning', (data) => {
            this.updateMemoryWarning(data);
        });
        
        this.performanceManager.on('cacheUpdated', (data) => {
            this.updateCacheDisplay();
        });
        
        console.log('⚡ Performance events setup complete');
    }
    
    // Public interface methods
    show() {
        this.modalElement.style.display = 'block';
        this.isVisible = true;
        this.updateDisplay();
    }
    
    hide() {
        this.modalElement.style.display = 'none';
        this.isVisible = false;
    }
    
    switchTab(tabName) {
        this.activeTab = tabName;
        
        // Update button states
        this.modalElement.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update panel states
        this.modalElement.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-tab`);
        });
        
        // Update tab-specific content
        this.updateTabContent(tabName);
        
        console.log(`⚡ Switched to tab: ${tabName}`);
    }
    
    updateDisplay() {
        const report = this.performanceManager.getPerformanceReport();
        
        // Update overview metrics
        this.updateOverviewMetrics(report);
        
        // Update memory display
        this.updateMemoryDisplay(report.memory);
        
        // Update cache display
        this.updateCacheDisplay();
        
        // Update task display
        this.updateTaskDisplay();
        
        // Update status indicator
        this.updateStatusIndicator(report);
        
        // Update last update time
        const lastUpdateElement = this.modalElement.querySelector('#last-update');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = `Last update: ${new Date().toLocaleTimeString()}`;
        }
    }
    
    updateOverviewMetrics(report) {
        const score = this.calculatePerformanceScore(report);
        
        // Update performance score
        const scoreElement = this.modalElement.querySelector('#performance-score');
        if (scoreElement) {
            scoreElement.textContent = score.toFixed(0);
        }
        
        // Update memory usage
        const memoryElement = this.modalElement.querySelector('#memory-usage');
        const memoryProgress = this.modalElement.querySelector('#memory-progress');
        if (memoryElement && report.memory) {
            const percentage = report.memory.percentage || 0;
            memoryElement.textContent = `${percentage.toFixed(1)}%`;
            if (memoryProgress) {
                memoryProgress.style.width = `${percentage}%`;
            }
        }
        
        // Update cache hit rate
        const cacheElement = this.modalElement.querySelector('#cache-hit-rate');
        if (cacheElement && report.cache) {
            const hitRate = this.calculateOverallHitRate(report.cache);
            cacheElement.textContent = `${(hitRate * 100).toFixed(1)}%`;
        }
        
        // Update background tasks
        const tasksElement = this.modalElement.querySelector('#active-tasks');
        if (tasksElement) {
            tasksElement.textContent = report.backgroundTasks || 0;
        }
        
        // Update lazy loading
        const lazyElement = this.modalElement.querySelector('#lazy-loaded');
        if (lazyElement) {
            lazyElement.textContent = report.lazyLoadedItems || 0;
        }
    }
    
    updateMemoryDisplay(memoryData) {
        if (!memoryData) return;
        
        const elements = {
            'memory-used': `${(memoryData.used / 1024 / 1024).toFixed(2)} MB`,
            'memory-total': `${(memoryData.total / 1024 / 1024).toFixed(2)} MB`,
            'memory-limit': `${(memoryData.limit / 1024 / 1024).toFixed(2)} MB`,
            'memory-percentage': `${memoryData.percentage.toFixed(1)}%`
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = this.modalElement.querySelector(`#${id}`);
            if (element) {
                element.textContent = value;
            }
        }
    }
    
    updateCacheDisplay() {
        // Update cache metrics for each layer
        const cacheMetrics = this.performanceManager.getCacheMetrics();
        
        for (const [layer, metrics] of Object.entries(cacheMetrics)) {
            const entriesElement = this.modalElement.querySelector(`#${layer}-cache-entries`);
            const sizeElement = this.modalElement.querySelector(`#${layer}-cache-size`);
            const hitRateElement = this.modalElement.querySelector(`#${layer}-cache-hit-rate`);
            
            if (entriesElement) entriesElement.textContent = metrics.entries;
            if (sizeElement) sizeElement.textContent = this.formatBytes(metrics.totalSize);
            if (hitRateElement) hitRateElement.textContent = `${(metrics.hitRate * 100).toFixed(1)}%`;
        }
    }
    
    updateTaskDisplay() {
        // Update active tasks count and list
        const activeTasks = this.performanceManager.backgroundTasks.size;
        const activeTasksElement = this.modalElement.querySelector('#active-tasks-count');
        if (activeTasksElement) {
            activeTasksElement.textContent = activeTasks;
        }
    }
    
    updateStatusIndicator(report) {
        const score = this.calculatePerformanceScore(report);
        let status, icon, className;
        
        if (score >= 80) {
            status = 'Excellent';
            icon = '⚡';
            className = 'excellent';
        } else if (score >= 60) {
            status = 'Good';
            icon = '✅';
            className = 'good';
        } else if (score >= 40) {
            status = 'Fair';
            icon = '⚠️';
            className = 'fair';
        } else {
            status = 'Poor';
            icon = '❌';
            className = 'poor';
        }
        
        // Update status indicator
        const statusIcon = this.statusIndicator?.querySelector('#perf-status-icon');
        const tooltipStatus = this.statusIndicator?.querySelector('#tooltip-status');
        
        if (statusIcon) statusIcon.textContent = icon;
        if (tooltipStatus) tooltipStatus.textContent = status;
        
        // Update tooltip metrics
        const tooltipMemory = this.statusIndicator?.querySelector('#tooltip-memory');
        const tooltipCache = this.statusIndicator?.querySelector('#tooltip-cache');
        
        if (tooltipMemory && report.memory) {
            tooltipMemory.textContent = `${report.memory.percentage.toFixed(1)}%`;
        }
        
        if (tooltipCache && report.cache) {
            const hitRate = this.calculateOverallHitRate(report.cache);
            tooltipCache.textContent = `${(hitRate * 100).toFixed(1)}%`;
        }
        
        // Update modal status
        const modalStatusText = this.modalElement.querySelector('#performance-status-text');
        const modalIndicator = this.modalElement.querySelector('#performance-indicator');
        
        if (modalStatusText) modalStatusText.textContent = status;
        if (modalIndicator) {
            modalIndicator.className = `status-indicator ${className}`;
        }
    }
    
    updateTabContent(tabName) {
        switch (tabName) {
            case 'overview':
                this.updateOverviewTab();
                break;
            case 'memory':
                this.updateMemoryTab();
                break;
            case 'cache':
                this.updateCacheTab();
                break;
            case 'tasks':
                this.updateTasksTab();
                break;
            case 'optimization':
                this.updateOptimizationTab();
                break;
            case 'advanced':
                this.updateAdvancedTab();
                break;
        }
    }
    
    updateOverviewTab() {
        // Update performance chart
        this.updatePerformanceChart();
        
        // Update alerts
        this.updatePerformanceAlerts();
    }
    
    updateMemoryTab() {
        // Update memory chart
        this.updateMemoryChart();
    }
    
    updateCacheTab() {
        // Update cache table
        this.updateCacheTable();
        
        // Update cache performance chart
        this.updateCachePerformanceChart();
    }
    
    updateTasksTab() {
        // Update active tasks list
        this.updateActiveTasksList();
        
        // Update task history
        this.updateTaskHistory();
        
        // Update task performance chart
        this.updateTaskPerformanceChart();
    }
    
    updateOptimizationTab() {
        // Update optimization score
        this.updateOptimizationScore();
        
        // Update recommendations
        this.updateOptimizationRecommendations();
    }
    
    updateAdvancedTab() {
        // Update service worker status
        this.updateServiceWorkerStatus();
    }
    
    // Action methods
    async optimizeNow() {
        try {
            this.showNotification('Running optimization...', 'info');
            const report = this.performanceManager.optimizeNow();
            this.updateDisplay();
            this.showNotification('Optimization completed', 'success');
            return report;
        } catch (error) {
            this.showNotification(`Optimization failed: ${error.message}`, 'error');
        }
    }
    
    exportReport() {
        const report = this.performanceManager.getPerformanceReport();
        const reportData = {
            timestamp: new Date().toISOString(),
            performance: report,
            recommendations: this.generateRecommendations(report)
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Performance report exported', 'success');
    }
    
    forceGarbageCollection() {
        this.performanceManager.handleLowMemory();
        this.showNotification('Garbage collection completed', 'success');
        this.updateDisplay();
    }
    
    clearAllCache() {
        for (const [layer, cache] of this.performanceManager.cacheSystem) {
            cache.clear();
        }
        this.showNotification('All caches cleared', 'success');
        this.updateDisplay();
    }
    
    clearCacheLayer(layer) {
        const cache = this.performanceManager.cacheSystem.get(layer);
        if (cache) {
            cache.clear();
            this.showNotification(`${layer} cache cleared`, 'success');
            this.updateDisplay();
        }
    }
    
    // Utility methods
    calculatePerformanceScore(report) {
        let score = 100;
        
        // Memory score (30% weight)
        if (report.memory && report.memory.percentage > 80) {
            score -= (report.memory.percentage - 80) * 1.5;
        }
        
        // Cache score (25% weight)
        if (report.cache) {
            const hitRate = this.calculateOverallHitRate(report.cache);
            if (hitRate < 0.5) {
                score -= (0.5 - hitRate) * 50;
            }
        }
        
        // Task score (25% weight)
        if (report.backgroundTasks > 10) {
            score -= (report.backgroundTasks - 10) * 2;
        }
        
        // Loading score (20% weight)
        // This would be based on lazy loading performance
        
        return Math.max(0, Math.min(100, score));
    }
    
    calculateOverallHitRate(cacheData) {
        let totalHits = 0;
        let totalEntries = 0;
        
        for (const metrics of Object.values(cacheData)) {
            totalHits += metrics.totalHits || 0;
            totalEntries += metrics.entries || 0;
        }
        
        return totalEntries > 0 ? totalHits / totalEntries : 0;
    }
    
    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    generateRecommendations(report) {
        const recommendations = [];
        
        if (report.memory && report.memory.percentage > 80) {
            recommendations.push({
                type: 'memory',
                priority: 'high',
                title: 'High Memory Usage',
                description: 'Memory usage is above 80%. Consider clearing caches or optimizing data structures.',
                action: 'optimize-memory'
            });
        }
        
        if (report.cache) {
            const hitRate = this.calculateOverallHitRate(report.cache);
            if (hitRate < 0.3) {
                recommendations.push({
                    type: 'cache',
                    priority: 'medium',
                    title: 'Low Cache Hit Rate',
                    description: 'Cache hit rate is below 30%. Review caching strategy.',
                    action: 'optimize-cache'
                });
            }
        }
        
        return recommendations;
    }
    
    addPerformanceAlert(data) {
        const alertsList = this.modalElement.querySelector('#performance-alerts-list');
        if (!alertsList) return;
        
        // Remove "no alerts" message
        const noAlerts = alertsList.querySelector('.no-alerts');
        if (noAlerts) {
            noAlerts.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = 'performance-alert';
        alert.innerHTML = `
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
                <h4>${data.name}</h4>
                <p>Duration: ${data.duration.toFixed(2)}ms</p>
                <small>${new Date().toLocaleTimeString()}</small>
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        alertsList.prepend(alert);
        
        // Keep only last 10 alerts
        while (alertsList.children.length > 10) {
            alertsList.lastChild.remove();
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Chart update methods (placeholder implementations)
    updatePerformanceChart() {
        // Implementation would create/update performance timeline chart
        console.log('⚡ Performance chart updated');
    }
    
    updateMemoryChart() {
        // Implementation would create/update memory usage chart
        console.log('⚡ Memory chart updated');
    }
    
    updateCachePerformanceChart() {
        // Implementation would create/update cache performance chart
        console.log('⚡ Cache performance chart updated');
    }
    
    updateTaskPerformanceChart() {
        // Implementation would create/update task performance chart
        console.log('⚡ Task performance chart updated');
    }
    
    updatePerformanceAlerts() {
        // Update performance alerts display
        console.log('⚡ Performance alerts updated');
    }
    
    updateCacheTable() {
        // Update cache entries table
        console.log('⚡ Cache table updated');
    }
    
    updateActiveTasksList() {
        // Update active tasks display
        console.log('⚡ Active tasks list updated');
    }
    
    updateTaskHistory() {
        // Update task history display
        console.log('⚡ Task history updated');
    }
    
    updateOptimizationScore() {
        // Update optimization score display
        console.log('⚡ Optimization score updated');
    }
    
    updateOptimizationRecommendations() {
        // Update optimization recommendations
        console.log('⚡ Optimization recommendations updated');
    }
    
    updateServiceWorkerStatus() {
        // Update service worker status display
        console.log('⚡ Service worker status updated');
    }
    
    // Auto-update functionality
    startAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        this.updateTimer = setInterval(() => {
            if (this.isVisible) {
                this.updateDisplay();
            }
        }, this.options.updateInterval);
        
        console.log('⚡ Auto-update started');
    }
    
    stopAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
        
        console.log('⚡ Auto-update stopped');
    }
    
    // Cleanup
    destroy() {
        this.stopAutoUpdate();
        
        if (this.modalElement && this.modalElement.parentElement) {
            this.modalElement.remove();
        }
        
        if (this.statusIndicator && this.statusIndicator.parentElement) {
            this.statusIndicator.remove();
        }
        
        console.log('⚡ Performance Interface destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceInterface;
} else if (typeof window !== 'undefined') {
    window.PerformanceInterface = PerformanceInterface;
}