/**
 * Advanced Testing Suite - Test Management Interface
 * Comprehensive user interface for test management, execution, and reporting
 * 
 * Features:
 * - Test suite management and organization
 * - Interactive test runner with real-time results
 * - Coverage visualization and reporting
 * - Accessibility testing dashboard
 * - Performance metrics and analysis
 * - Visual regression testing interface
 * - CI/CD integration and automation
 * - Test history and trend analysis
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class TestSuiteInterface {
    constructor() {
        this.framework = null;
        this.isOpen = false;
        this.currentTab = 'overview';
        this.runningTests = false;
        this.testResults = null;
        this.testHistory = [];
        this.filters = {
            status: 'all',
            suite: 'all',
            search: ''
        };
        this.settings = {
            autoRun: false,
            watchMode: false,
            parallelExecution: true,
            coverage: true,
            accessibility: true,
            performance: true,
            visual: true
        };
        
        this.initializeInterface();
    }
    
    /**
     * Initialize the test interface
     */
    initializeInterface() {
        this.setupEventHandlers();
        this.loadTestHistory();
        this.loadSettings();
        
        console.log('🧪 Test Suite Interface initialized');
    }
    
    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    /**
     * Load test history from storage
     */
    loadTestHistory() {
        try {
            const history = localStorage.getItem('testSuite_history');
            if (history) {
                this.testHistory = JSON.parse(history);
            }
        } catch (error) {
            console.warn('Failed to load test history:', error);
            this.testHistory = [];
        }
    }
    
    /**
     * Save test history to storage
     */
    saveTestHistory() {
        try {
            localStorage.setItem('testSuite_history', JSON.stringify(this.testHistory));
        } catch (error) {
            console.warn('Failed to save test history:', error);
        }
    }
    
    /**
     * Load settings from storage
     */
    loadSettings() {
        try {
            const settings = localStorage.getItem('testSuite_settings');
            if (settings) {
                this.settings = { ...this.settings, ...JSON.parse(settings) };
            }
        } catch (error) {
            console.warn('Failed to load test settings:', error);
        }
    }
    
    /**
     * Save settings to storage
     */
    saveSettings() {
        try {
            localStorage.setItem('testSuite_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save test settings:', error);
        }
    }
    
    /**
     * Toggle test suite interface
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    /**
     * Open test suite interface
     */
    async open(testFramework = null) {
        if (this.isOpen) return;
        
        this.framework = testFramework || window.testFramework;
        if (!this.framework) {
            console.error('Test framework not available');
            return;
        }
        
        this.isOpen = true;
        
        // Create and show modal
        this.createModal();
        this.render();
        
        // Auto-discover tests if framework is available
        await this.discoverTests();
    }
    
    /**
     * Close test suite interface
     */
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        const modal = document.querySelector('.test-suite-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    /**
     * Create modal structure
     */
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'test-suite-modal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title-section">
                            <h2 class="modal-title">
                                🧪 Advanced Testing Suite
                            </h2>
                            <div class="test-status">
                                <div class="status-indicator" id="testStatus"></div>
                                <span id="testStatusText">Ready</span>
                            </div>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-primary" id="runAllTests">
                                <span>🚀</span> Run All Tests
                            </button>
                            <button class="btn btn-secondary" id="closeTests" title="Close (Ctrl+T)">
                                <span>✕</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="test-suite-tabs">
                        <nav class="tab-navigation">
                            <button class="tab-btn active" data-tab="overview">
                                <span>📊</span> Overview
                            </button>
                            <button class="tab-btn" data-tab="tests">
                                <span>🧪</span> Tests
                            </button>
                            <button class="tab-btn" data-tab="coverage">
                                <span>📈</span> Coverage
                            </button>
                            <button class="tab-btn" data-tab="accessibility">
                                <span>♿</span> Accessibility
                            </button>
                            <button class="tab-btn" data-tab="performance">
                                <span>⚡</span> Performance
                            </button>
                            <button class="tab-btn" data-tab="visual">
                                <span>👁️</span> Visual
                            </button>
                            <button class="tab-btn" data-tab="automation">
                                <span>🤖</span> Automation
                            </button>
                            <button class="tab-btn" data-tab="settings">
                                <span>⚙️</span> Settings
                            </button>
                        </nav>
                        
                        <div class="tab-content">
                            <div class="tab-panel active" id="overview-panel"></div>
                            <div class="tab-panel" id="tests-panel"></div>
                            <div class="tab-panel" id="coverage-panel"></div>
                            <div class="tab-panel" id="accessibility-panel"></div>
                            <div class="tab-panel" id="performance-panel"></div>
                            <div class="tab-panel" id="visual-panel"></div>
                            <div class="tab-panel" id="automation-panel"></div>
                            <div class="tab-panel" id="settings-panel"></div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="footer-info">
                            <span id="testCount">0 tests discovered</span>
                            <span id="lastRun">Never run</span>
                        </div>
                        <div class="footer-actions">
                            <button class="btn btn-sm btn-secondary" id="exportResults">
                                Export Results
                            </button>
                            <button class="btn btn-sm btn-secondary" id="importTests">
                                Import Tests
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup event listeners
        this.setupModalEvents(modal);
    }
    
    /**
     * Setup modal event listeners
     */
    setupModalEvents(modal) {
        // Close button
        modal.querySelector('#closeTests').addEventListener('click', () => {
            this.close();
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
        
        // Tab navigation
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Run all tests
        modal.querySelector('#runAllTests').addEventListener('click', () => {
            this.runAllTests();
        });
        
        // Export results
        modal.querySelector('#exportResults').addEventListener('click', () => {
            this.exportResults();
        });
        
        // Import tests
        modal.querySelector('#importTests').addEventListener('click', () => {
            this.importTests();
        });
    }
    
    /**
     * Switch tab
     */
    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        const modal = document.querySelector('.test-suite-modal');
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        // Update tab panels
        modal.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tab}-panel`);
        });
        
        // Render current tab
        this.renderTab(tab);
    }
    
    /**
     * Render the interface
     */
    render() {
        this.renderOverview();
        this.updateStatus();
    }
    
    /**
     * Render tab content
     */
    renderTab(tab) {
        switch (tab) {
            case 'overview':
                this.renderOverview();
                break;
            case 'tests':
                this.renderTestsList();
                break;
            case 'coverage':
                this.renderCoverage();
                break;
            case 'accessibility':
                this.renderAccessibility();
                break;
            case 'performance':
                this.renderPerformance();
                break;
            case 'visual':
                this.renderVisual();
                break;
            case 'automation':
                this.renderAutomation();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }
    
    /**
     * Render overview tab
     */
    renderOverview() {
        const panel = document.getElementById('overview-panel');
        if (!panel) return;
        
        const testCount = this.framework ? this.framework.tests.size : 0;
        const suiteCount = this.framework ? this.framework.suites.size : 0;
        
        panel.innerHTML = `
            <div class="test-overview">
                <div class="overview-cards">
                    <div class="overview-card">
                        <div class="card-icon">🧪</div>
                        <div class="card-content">
                            <h3>Tests</h3>
                            <div class="card-value">${testCount}</div>
                            <div class="card-subtitle">${suiteCount} suites</div>
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <div class="card-icon">📈</div>
                        <div class="card-content">
                            <h3>Coverage</h3>
                            <div class="card-value">${this.testResults ? this.testResults.coverage.overall.statements : 0}%</div>
                            <div class="card-subtitle">Statements</div>
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <div class="card-icon">♿</div>
                        <div class="card-content">
                            <h3>Accessibility</h3>
                            <div class="card-value">${this.testResults ? this.testResults.accessibility.totalViolations : 0}</div>
                            <div class="card-subtitle">Violations</div>
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <div class="card-icon">⚡</div>
                        <div class="card-content">
                            <h3>Performance</h3>
                            <div class="card-value">${this.testResults ? Math.round(this.testResults.performance.averageTestDuration) : 0}ms</div>
                            <div class="card-subtitle">Avg duration</div>
                        </div>
                    </div>
                </div>
                
                <div class="test-history-chart">
                    <h3>Test History</h3>
                    <div class="chart-container">
                        <canvas id="testHistoryChart" width="800" height="200"></canvas>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="testSuite.runAllTests()">
                            <span>🚀</span> Run All Tests
                        </button>
                        <button class="btn btn-secondary" onclick="testSuite.runFailedTests()">
                            <span>🔄</span> Re-run Failed
                        </button>
                        <button class="btn btn-secondary" onclick="testSuite.runCoverageReport()">
                            <span>📊</span> Coverage Report
                        </button>
                        <button class="btn btn-secondary" onclick="testSuite.runAccessibilityAudit()">
                            <span>♿</span> Accessibility Audit
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.renderTestHistoryChart();
    }
    
    /**
     * Render test history chart
     */
    renderTestHistoryChart() {
        const canvas = document.getElementById('testHistoryChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (this.testHistory.length === 0) {
            ctx.fillStyle = '#6b7280';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No test history available', width / 2, height / 2);
            return;
        }
        
        // Draw chart
        const margin = 40;
        const chartWidth = width - 2 * margin;
        const chartHeight = height - 2 * margin;
        
        // Get data points
        const maxTests = Math.max(...this.testHistory.map(h => h.total));
        const points = this.testHistory.map((history, index) => ({
            x: margin + (index / (this.testHistory.length - 1)) * chartWidth,
            y: margin + chartHeight - (history.passed / maxTests) * chartHeight,
            history
        }));
        
        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = margin + (i / 5) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(width - margin, y);
            ctx.stroke();
        }
        
        // Draw line
        if (points.length > 1) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
            
            // Draw points
            ctx.fillStyle = '#10b981';
            points.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    }
    
    /**
     * Render tests list
     */
    renderTestsList() {
        const panel = document.getElementById('tests-panel');
        if (!panel) return;
        
        const tests = this.framework ? Array.from(this.framework.tests.values()) : [];
        const filteredTests = this.filterTests(tests);
        
        panel.innerHTML = `
            <div class="tests-panel">
                <div class="tests-toolbar">
                    <div class="test-filters">
                        <select id="statusFilter" class="form-control">
                            <option value="all">All Tests</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                            <option value="skipped">Skipped</option>
                        </select>
                        
                        <select id="suiteFilter" class="form-control">
                            <option value="all">All Suites</option>
                            ${this.framework ? Array.from(this.framework.suites.keys()).map(suite => 
                                `<option value="${suite}">${suite}</option>`
                            ).join('') : ''}
                        </select>
                        
                        <input type="text" id="testSearch" class="form-control" placeholder="Search tests..." />
                    </div>
                    
                    <div class="test-actions">
                        <button class="btn btn-sm btn-primary" onclick="testSuite.runSelectedTests()">
                            Run Selected
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="testSuite.selectAllTests()">
                            Select All
                        </button>
                    </div>
                </div>
                
                <div class="tests-list">
                    ${filteredTests.length === 0 ? 
                        '<div class="no-tests">No tests found</div>' :
                        filteredTests.map(test => this.renderTestItem(test)).join('')
                    }
                </div>
            </div>
        `;
        
        this.setupTestsListEvents();
    }
    
    /**
     * Render test item
     */
    renderTestItem(test) {
        const statusIcon = {
            'passed': '✅',
            'failed': '❌',
            'pending': '⏳',
            'skipped': '⏭️'
        }[test.status] || '⚪';
        
        return `
            <div class="test-item ${test.status}" data-test-id="${test.id}">
                <div class="test-checkbox">
                    <input type="checkbox" id="test_${test.id}" />
                </div>
                
                <div class="test-status">
                    <span class="status-icon">${statusIcon}</span>
                </div>
                
                <div class="test-info">
                    <h4 class="test-title">${test.description}</h4>
                    <div class="test-meta">
                        <span class="test-suite">Suite: ${test.suite}</span>
                        <span class="test-duration">${test.duration ? Math.round(test.duration) + 'ms' : '-'}</span>
                    </div>
                    ${test.error ? `<div class="test-error">${test.error.message}</div>` : ''}
                </div>
                
                <div class="test-actions">
                    <button class="btn btn-sm btn-secondary" onclick="testSuite.runSingleTest('${test.id}')">
                        Run
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="testSuite.debugTest('${test.id}')">
                        Debug
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Setup tests list events
     */
    setupTestsListEvents() {
        const statusFilter = document.getElementById('statusFilter');
        const suiteFilter = document.getElementById('suiteFilter');
        const testSearch = document.getElementById('testSearch');
        
        if (statusFilter) {
            statusFilter.value = this.filters.status;
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.renderTestsList();
            });
        }
        
        if (suiteFilter) {
            suiteFilter.value = this.filters.suite;
            suiteFilter.addEventListener('change', (e) => {
                this.filters.suite = e.target.value;
                this.renderTestsList();
            });
        }
        
        if (testSearch) {
            testSearch.value = this.filters.search;
            testSearch.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.renderTestsList();
            });
        }
    }
    
    /**
     * Filter tests based on current filters
     */
    filterTests(tests) {
        return tests.filter(test => {
            // Status filter
            if (this.filters.status !== 'all' && test.status !== this.filters.status) {
                return false;
            }
            
            // Suite filter
            if (this.filters.suite !== 'all' && test.suite !== this.filters.suite) {
                return false;
            }
            
            // Search filter
            if (this.filters.search && !test.description.toLowerCase().includes(this.filters.search.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * Render coverage tab
     */
    renderCoverage() {
        const panel = document.getElementById('coverage-panel');
        if (!panel) return;
        
        const coverage = this.testResults ? this.testResults.coverage : null;
        
        panel.innerHTML = `
            <div class="coverage-panel">
                <div class="coverage-overview">
                    <h3>Coverage Overview</h3>
                    <div class="coverage-metrics">
                        <div class="coverage-metric">
                            <label>Statements</label>
                            <div class="coverage-bar">
                                <div class="coverage-fill" style="width: ${coverage ? coverage.overall.statements : 0}%"></div>
                            </div>
                            <span class="coverage-percentage">${coverage ? coverage.overall.statements : 0}%</span>
                        </div>
                        
                        <div class="coverage-metric">
                            <label>Branches</label>
                            <div class="coverage-bar">
                                <div class="coverage-fill" style="width: ${coverage ? coverage.overall.branches : 0}%"></div>
                            </div>
                            <span class="coverage-percentage">${coverage ? coverage.overall.branches : 0}%</span>
                        </div>
                        
                        <div class="coverage-metric">
                            <label>Functions</label>
                            <div class="coverage-bar">
                                <div class="coverage-fill" style="width: ${coverage ? coverage.overall.functions : 0}%"></div>
                            </div>
                            <span class="coverage-percentage">${coverage ? coverage.overall.functions : 0}%</span>
                        </div>
                        
                        <div class="coverage-metric">
                            <label>Lines</label>
                            <div class="coverage-bar">
                                <div class="coverage-fill" style="width: ${coverage ? coverage.overall.lines : 0}%"></div>
                            </div>
                            <span class="coverage-percentage">${coverage ? coverage.overall.lines : 0}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="coverage-details">
                    <h3>File Coverage</h3>
                    <div class="coverage-files">
                        ${coverage && coverage.files && coverage.files.length > 0 ? 
                            coverage.files.map(file => this.renderCoverageFile(file)).join('') :
                            '<div class="no-coverage">No coverage data available</div>'
                        }
                    </div>
                </div>
                
                <div class="coverage-actions">
                    <button class="btn btn-primary" onclick="testSuite.generateCoverageReport()">
                        Generate Detailed Report
                    </button>
                    <button class="btn btn-secondary" onclick="testSuite.exportCoverage()">
                        Export Coverage
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render coverage file
     */
    renderCoverageFile(file) {
        return `
            <div class="coverage-file">
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <div class="file-metrics">
                        <span>Statements: ${file.statements}%</span>
                        <span>Branches: ${file.branches}%</span>
                        <span>Functions: ${file.functions}%</span>
                        <span>Lines: ${file.lines}%</span>
                    </div>
                </div>
                <div class="file-coverage">
                    <div class="coverage-fill" style="width: ${file.statements}%"></div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render accessibility tab
     */
    renderAccessibility() {
        const panel = document.getElementById('accessibility-panel');
        if (!panel) return;
        
        const accessibility = this.testResults ? this.testResults.accessibility : null;
        
        panel.innerHTML = `
            <div class="accessibility-panel">
                <div class="accessibility-overview">
                    <h3>Accessibility Overview</h3>
                    <div class="accessibility-summary">
                        <div class="summary-card ${accessibility && accessibility.compliance ? 'compliant' : 'non-compliant'}">
                            <div class="card-icon">${accessibility && accessibility.compliance ? '✅' : '❌'}</div>
                            <div class="card-content">
                                <h4>WCAG ${accessibility ? accessibility.wcagLevel : 'AA'} Compliance</h4>
                                <div class="card-value">${accessibility && accessibility.compliance ? 'Compliant' : 'Non-compliant'}</div>
                                <div class="card-subtitle">${accessibility ? accessibility.totalViolations : 0} violations found</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="accessibility-violations">
                    <h3>Accessibility Violations</h3>
                    <div class="violations-list">
                        ${accessibility && accessibility.violationsByRule && Object.keys(accessibility.violationsByRule).length > 0 ?
                            Object.entries(accessibility.violationsByRule).map(([rule, violations]) => 
                                this.renderAccessibilityRule(rule, violations)
                            ).join('') :
                            '<div class="no-violations">No accessibility violations found</div>'
                        }
                    </div>
                </div>
                
                <div class="accessibility-actions">
                    <button class="btn btn-primary" onclick="testSuite.runAccessibilityAudit()">
                        Run Accessibility Audit
                    </button>
                    <button class="btn btn-secondary" onclick="testSuite.exportAccessibilityReport()">
                        Export Report
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render accessibility rule violations
     */
    renderAccessibilityRule(rule, violations) {
        return `
            <div class="violation-rule">
                <h4>${rule} (${violations.length} violations)</h4>
                <div class="rule-violations">
                    ${violations.map(violation => `
                        <div class="violation-item">
                            <div class="violation-element">${violation.element}</div>
                            <div class="violation-issue">${violation.issue}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Render performance tab
     */
    renderPerformance() {
        const panel = document.getElementById('performance-panel');
        if (!panel) return;
        
        const performance = this.testResults ? this.testResults.performance : null;
        
        panel.innerHTML = `
            <div class="performance-panel">
                <div class="performance-overview">
                    <h3>Performance Overview</h3>
                    <div class="performance-metrics">
                        <div class="metric-card">
                            <h4>Average Test Duration</h4>
                            <div class="metric-value">${performance ? Math.round(performance.averageTestDuration) : 0}ms</div>
                        </div>
                        
                        <div class="metric-card">
                            <h4>Memory Usage</h4>
                            <div class="metric-value">${performance ? Math.round(performance.memoryUsage.average / 1024 / 1024) : 0}MB</div>
                            <div class="metric-subtitle">Peak: ${performance ? Math.round(performance.memoryUsage.peak / 1024 / 1024) : 0}MB</div>
                        </div>
                        
                        <div class="metric-card">
                            <h4>Network Requests</h4>
                            <div class="metric-value">${performance ? performance.networkRequests : 0}</div>
                        </div>
                    </div>
                </div>
                
                <div class="performance-recommendations">
                    <h3>Performance Recommendations</h3>
                    <div class="recommendations-list">
                        ${performance && performance.recommendations && performance.recommendations.length > 0 ?
                            performance.recommendations.map(rec => `
                                <div class="recommendation-item">
                                    <div class="recommendation-icon">💡</div>
                                    <div class="recommendation-content">${rec}</div>
                                </div>
                            `).join('') :
                            '<div class="no-recommendations">No performance recommendations at this time</div>'
                        }
                    </div>
                </div>
                
                <div class="performance-actions">
                    <button class="btn btn-primary" onclick="testSuite.runPerformanceBenchmark()">
                        Run Performance Benchmark
                    </button>
                    <button class="btn btn-secondary" onclick="testSuite.exportPerformanceReport()">
                        Export Report
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render visual testing tab
     */
    renderVisual() {
        const panel = document.getElementById('visual-panel');
        if (!panel) return;
        
        const visual = this.testResults ? this.testResults.visual : null;
        
        panel.innerHTML = `
            <div class="visual-panel">
                <div class="visual-overview">
                    <h3>Visual Testing Overview</h3>
                    <div class="visual-stats">
                        <div class="stat-item">
                            <label>Total Snapshots</label>
                            <span>${visual ? visual.totalSnapshots : 0}</span>
                        </div>
                        <div class="stat-item">
                            <label>Changed Snapshots</label>
                            <span>${visual ? visual.changedSnapshots : 0}</span>
                        </div>
                        <div class="stat-item">
                            <label>New Snapshots</label>
                            <span>${visual ? visual.newSnapshots : 0}</span>
                        </div>
                    </div>
                </div>
                
                <div class="visual-diffs">
                    <h3>Visual Changes</h3>
                    <div class="diffs-list">
                        ${visual && visual.diffs && visual.diffs.length > 0 ?
                            visual.diffs.map(diff => this.renderVisualDiff(diff)).join('') :
                            '<div class="no-diffs">No visual changes detected</div>'
                        }
                    </div>
                </div>
                
                <div class="visual-actions">
                    <button class="btn btn-primary" onclick="testSuite.captureVisualBaselines()">
                        Capture Baselines
                    </button>
                    <button class="btn btn-secondary" onclick="testSuite.approveVisualChanges()">
                        Approve Changes
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render visual diff
     */
    renderVisualDiff(diff) {
        return `
            <div class="visual-diff">
                <h4>Test: ${diff.test}</h4>
                <div class="diff-summary">
                    <div class="diff-stats">
                        <span>Elements Added: ${diff.diff.elements.added.length}</span>
                        <span>Elements Removed: ${diff.diff.elements.removed.length}</span>
                        <span>Elements Modified: ${diff.diff.elements.modified.length}</span>
                    </div>
                </div>
                <div class="diff-actions">
                    <button class="btn btn-sm btn-success" onclick="testSuite.approveDiff('${diff.test}')">
                        Approve
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="testSuite.rejectDiff('${diff.test}')">
                        Reject
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render automation tab
     */
    renderAutomation() {
        const panel = document.getElementById('automation-panel');
        if (!panel) return;
        
        panel.innerHTML = `
            <div class="automation-panel">
                <div class="ci-cd-integration">
                    <h3>CI/CD Integration</h3>
                    <div class="integration-options">
                        <div class="integration-item">
                            <h4>GitHub Actions</h4>
                            <p>Integrate tests with GitHub Actions workflow</p>
                            <button class="btn btn-primary" onclick="testSuite.generateGitHubWorkflow()">
                                Generate Workflow
                            </button>
                        </div>
                        
                        <div class="integration-item">
                            <h4>Jenkins</h4>
                            <p>Create Jenkins pipeline configuration</p>
                            <button class="btn btn-primary" onclick="testSuite.generateJenkinsPipeline()">
                                Generate Pipeline
                            </button>
                        </div>
                        
                        <div class="integration-item">
                            <h4>Azure DevOps</h4>
                            <p>Setup Azure DevOps pipeline</p>
                            <button class="btn btn-primary" onclick="testSuite.generateAzureDevOpsPipeline()">
                                Generate Pipeline
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="test-automation">
                    <h3>Test Automation</h3>
                    <div class="automation-settings">
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" ${this.settings.autoRun ? 'checked' : ''} 
                                       onchange="testSuite.updateSetting('autoRun', this.checked)" />
                                Auto-run tests on file changes
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" ${this.settings.watchMode ? 'checked' : ''} 
                                       onchange="testSuite.updateSetting('watchMode', this.checked)" />
                                Watch mode (continuous testing)
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="test-scheduling">
                    <h3>Scheduled Testing</h3>
                    <div class="schedule-options">
                        <div class="schedule-item">
                            <label for="testSchedule">Test Schedule:</label>
                            <select id="testSchedule" class="form-control" onchange="testSuite.updateTestSchedule(this.value)">
                                <option value="none">No scheduled tests</option>
                                <option value="hourly">Every hour</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render settings tab
     */
    renderSettings() {
        const panel = document.getElementById('settings-panel');
        if (!panel) return;
        
        panel.innerHTML = `
            <div class="settings-panel">
                <div class="settings-section">
                    <h3>Test Execution</h3>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.parallelExecution ? 'checked' : ''} 
                                   onchange="testSuite.updateSetting('parallelExecution', this.checked)" />
                            Parallel test execution
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>Test timeout (ms):</label>
                        <input type="number" class="form-control" value="${this.framework ? this.framework.config.timeout : 5000}" 
                               onchange="testSuite.updateTimeout(this.value)" />
                    </div>
                    
                    <div class="setting-item">
                        <label>Retry attempts:</label>
                        <input type="number" class="form-control" value="${this.framework ? this.framework.config.retries : 2}" 
                               onchange="testSuite.updateRetries(this.value)" />
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>Test Features</h3>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.coverage ? 'checked' : ''} 
                                   onchange="testSuite.updateSetting('coverage', this.checked)" />
                            Code coverage collection
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.accessibility ? 'checked' : ''} 
                                   onchange="testSuite.updateSetting('accessibility', this.checked)" />
                            Accessibility testing
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.performance ? 'checked' : ''} 
                                   onchange="testSuite.updateSetting('performance', this.checked)" />
                            Performance monitoring
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.settings.visual ? 'checked' : ''} 
                                   onchange="testSuite.updateSetting('visual', this.checked)" />
                            Visual regression testing
                        </label>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>Reporting</h3>
                    <div class="setting-item">
                        <label>Report format:</label>
                        <select class="form-control">
                            <option value="html">HTML Report</option>
                            <option value="json">JSON Export</option>
                            <option value="junit">JUnit XML</option>
                            <option value="lcov">LCOV Coverage</option>
                        </select>
                    </div>
                </div>
                
                <div class="settings-actions">
                    <button class="btn btn-primary" onclick="testSuite.saveSettings()">
                        Save Settings
                    </button>
                    <button class="btn btn-secondary" onclick="testSuite.resetSettings()">
                        Reset to Defaults
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Discover tests from the framework
     */
    async discoverTests() {
        if (!this.framework) return;
        
        try {
            console.log('🔍 Discovering tests...');
            
            // Update test count
            const testCount = this.framework.tests.size;
            const suiteCount = this.framework.suites.size;
            
            const testCountElement = document.getElementById('testCount');
            if (testCountElement) {
                testCountElement.textContent = `${testCount} tests in ${suiteCount} suites`;
            }
            
            this.render();
            
        } catch (error) {
            console.error('Failed to discover tests:', error);
        }
    }
    
    /**
     * Run all tests
     */
    async runAllTests() {
        if (!this.framework || this.runningTests) return;
        
        try {
            this.runningTests = true;
            this.updateStatus('running', 'Running tests...');
            
            console.log('🚀 Running all tests...');
            
            const results = await this.framework.run();
            
            this.testResults = results;
            this.addToHistory(results.summary);
            this.saveTestHistory();
            
            this.updateStatus('completed', `Completed: ${results.summary.passed}/${results.summary.total} passed`);
            
            // Update last run time
            const lastRunElement = document.getElementById('lastRun');
            if (lastRunElement) {
                lastRunElement.textContent = `Last run: ${new Date().toLocaleTimeString()}`;
            }
            
            this.render();
            
        } catch (error) {
            console.error('Failed to run tests:', error);
            this.updateStatus('error', 'Test execution failed');
        } finally {
            this.runningTests = false;
        }
    }
    
    /**
     * Update status indicator
     */
    updateStatus(status = 'ready', text = 'Ready') {
        const indicator = document.getElementById('testStatus');
        const statusText = document.getElementById('testStatusText');
        
        if (indicator) {
            indicator.className = `status-indicator ${status}`;
        }
        
        if (statusText) {
            statusText.textContent = text;
        }
    }
    
    /**
     * Add test results to history
     */
    addToHistory(summary) {
        this.testHistory.push({
            timestamp: new Date().toISOString(),
            ...summary
        });
        
        // Keep only last 50 runs
        if (this.testHistory.length > 50) {
            this.testHistory = this.testHistory.slice(-50);
        }
    }
    
    /**
     * Update setting
     */
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        
        // Update framework config if applicable
        if (this.framework) {
            if (key === 'parallelExecution') {
                this.framework.config.parallel = value;
            } else if (['coverage', 'accessibility', 'performance', 'visual'].includes(key)) {
                this.framework.config[key] = value;
            }
        }
    }
    
    /**
     * Export test results
     */
    exportResults() {
        if (!this.testResults) {
            alert('No test results to export');
            return;
        }
        
        const dataStr = JSON.stringify(this.testResults, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `test-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        link.click();
    }
    
    /**
     * Generate GitHub Actions workflow
     */
    generateGitHubWorkflow() {
        const workflow = `name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
`;

        const dataStr = workflow;
        const dataBlob = new Blob([dataStr], { type: 'text/yaml' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = '.github/workflows/test.yml';
        link.click();
        
        alert('GitHub Actions workflow generated! Save it to .github/workflows/test.yml in your repository.');
    }
}

// Global instance
let testSuite = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    testSuite = new TestSuiteInterface();
    
    // Make globally available
    window.testSuite = testSuite;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestSuiteInterface;
}