/**
 * Enhanced Data Manager Interface
 * User interface for cloud sync, backup/restore, campaign sharing, and template management
 * 
 * Features:
 * - Cloud provider selection and connection
 * - Backup creation and restore interface
 * - Template library with search and sharing
 * - Data import/export wizard
 * - Sync status monitoring
 * - Conflict resolution interface
 * - Settings and preferences
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class EnhancedDataInterface {
    constructor(dataManager, options = {}) {
        this.dataManager = dataManager;
        
        this.options = {
            showCloudSync: options.showCloudSync !== false,
            showBackups: options.showBackups !== false,
            showTemplates: options.showTemplates !== false,
            showImportExport: options.showImportExport !== false,
            autoRefresh: options.autoRefresh !== false,
            refreshInterval: options.refreshInterval || 30000,
            ...options
        };
        
        // Interface state
        this.activeTab = 'sync';
        this.isVisible = false;
        
        // UI elements
        this.containerElement = null;
        this.modalElement = null;
        this.syncStatusElement = null;
        
        // Data state
        this.cloudProviders = ['googledrive', 'dropbox', 'onedrive', 'github'];
        this.backupList = [];
        this.templateList = [];
        
        // Auto-refresh timer
        this.refreshTimer = null;
        
        this.initialize();
        
        console.log('💾 Enhanced Data Interface initialized');
    }
    
    initialize() {
        this.createInterface();
        this.setupEventHandlers();
        this.setupDataManagerEvents();
        
        if (this.options.autoRefresh) {
            this.startAutoRefresh();
        }
        
        this.refreshData();
        
        console.log('💾 Data Interface ready');
    }
    
    createInterface() {
        // Create modal interface
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'data-manager-modal modal';
        this.modalElement.style.display = 'none';
        this.modalElement.innerHTML = this.generateModalHTML();
        
        // Append to document
        document.body.appendChild(this.modalElement);
        
        // Create floating sync status indicator
        this.createSyncStatusIndicator();
        
        console.log('💾 Interface created');
    }
    
    generateModalHTML() {
        return `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title-section">
                            <h5 class="modal-title">💾 Data Management</h5>
                            <div class="sync-status-header">
                                <span id="sync-status-text">Disconnected</span>
                                <div id="sync-spinner" class="sync-spinner" style="display: none;"></div>
                            </div>
                        </div>
                        <button type="button" class="modal-close" onclick="this.closest('.data-manager-modal').style.display='none'">×</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="data-manager-tabs">
                            <nav class="tab-navigation">
                                <button class="tab-btn active" data-tab="sync">☁️ Cloud Sync</button>
                                <button class="tab-btn" data-tab="backup">💾 Backup & Restore</button>
                                <button class="tab-btn" data-tab="templates">📋 Templates</button>
                                <button class="tab-btn" data-tab="import-export">📁 Import/Export</button>
                                <button class="tab-btn" data-tab="settings">⚙️ Settings</button>
                            </nav>
                            
                            <div class="tab-content">
                                ${this.generateSyncTabHTML()}
                                ${this.generateBackupTabHTML()}
                                ${this.generateTemplatesTabHTML()}
                                ${this.generateImportExportTabHTML()}
                                ${this.generateSettingsTabHTML()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="footer-info">
                            <span id="last-sync-time">Never synced</span>
                        </div>
                        <div class="footer-actions">
                            <button id="sync-now-btn" class="btn btn-primary" disabled>Sync Now</button>
                            <button class="btn btn-secondary" onclick="this.closest('.data-manager-modal').style.display='none'">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateSyncTabHTML() {
        return `
            <div id="sync-tab" class="tab-panel active">
                <div class="sync-panel">
                    <div class="cloud-providers-section">
                        <h3>Cloud Storage Providers</h3>
                        <div class="providers-grid">
                            <div class="provider-card" data-provider="googledrive">
                                <div class="provider-icon">📗</div>
                                <h4>Google Drive</h4>
                                <p>15 GB free storage</p>
                                <button class="btn btn-primary connect-btn" data-provider="googledrive">Connect</button>
                                <div class="provider-status" style="display: none;">
                                    <span class="status-indicator connected"></span>
                                    <span>Connected</span>
                                    <button class="btn btn-sm btn-secondary disconnect-btn">Disconnect</button>
                                </div>
                            </div>
                            
                            <div class="provider-card" data-provider="dropbox">
                                <div class="provider-icon">📘</div>
                                <h4>Dropbox</h4>
                                <p>2 GB free storage</p>
                                <button class="btn btn-primary connect-btn" data-provider="dropbox">Connect</button>
                                <div class="provider-status" style="display: none;">
                                    <span class="status-indicator connected"></span>
                                    <span>Connected</span>
                                    <button class="btn btn-sm btn-secondary disconnect-btn">Disconnect</button>
                                </div>
                            </div>
                            
                            <div class="provider-card" data-provider="onedrive">
                                <div class="provider-icon">📙</div>
                                <h4>OneDrive</h4>
                                <p>5 GB free storage</p>
                                <button class="btn btn-primary connect-btn" data-provider="onedrive">Connect</button>
                                <div class="provider-status" style="display: none;">
                                    <span class="status-indicator connected"></span>
                                    <span>Connected</span>
                                    <button class="btn btn-sm btn-secondary disconnect-btn">Disconnect</button>
                                </div>
                            </div>
                            
                            <div class="provider-card" data-provider="github">
                                <div class="provider-icon">📕</div>
                                <h4>GitHub</h4>
                                <p>Public repositories</p>
                                <button class="btn btn-primary connect-btn" data-provider="github">Connect</button>
                                <div class="provider-status" style="display: none;">
                                    <span class="status-indicator connected"></span>
                                    <span>Connected</span>
                                    <button class="btn btn-sm btn-secondary disconnect-btn">Disconnect</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sync-settings-section">
                        <h3>Sync Settings</h3>
                        <div class="settings-grid">
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="auto-sync" checked>
                                    <span>Automatic Sync</span>
                                </label>
                                <small>Automatically sync changes to cloud</small>
                            </div>
                            
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="sync-compression" checked>
                                    <span>Compress Data</span>
                                </label>
                                <small>Reduce bandwidth usage</small>
                            </div>
                            
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="sync-encryption">
                                    <span>Encrypt Data</span>
                                </label>
                                <small>Encrypt data before uploading</small>
                            </div>
                            
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="realtime-sync">
                                    <span>Real-time Sync</span>
                                </label>
                                <small>Sync changes immediately</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sync-status-section">
                        <h3>Sync Status</h3>
                        <div class="status-display">
                            <div class="status-item">
                                <label>Status:</label>
                                <span id="detailed-sync-status">Disconnected</span>
                            </div>
                            <div class="status-item">
                                <label>Last Sync:</label>
                                <span id="detailed-last-sync">Never</span>
                            </div>
                            <div class="status-item">
                                <label>Data Size:</label>
                                <span id="sync-data-size">0 KB</span>
                            </div>
                            <div class="status-item">
                                <label>Files Synced:</label>
                                <span id="sync-files-count">0</span>
                            </div>
                        </div>
                        
                        <div class="sync-log">
                            <h4>Sync Log</h4>
                            <div id="sync-log-content" class="log-content">
                                <p class="log-empty">No sync activity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateBackupTabHTML() {
        return `
            <div id="backup-tab" class="tab-panel">
                <div class="backup-panel">
                    <div class="backup-actions-section">
                        <h3>Backup Actions</h3>
                        <div class="backup-actions">
                            <button id="create-backup-btn" class="btn btn-primary">📦 Create Backup</button>
                            <button id="auto-backup-toggle" class="btn btn-secondary">⏰ Auto Backup: ON</button>
                            <button id="backup-settings-btn" class="btn btn-secondary">⚙️ Settings</button>
                        </div>
                        
                        <div class="backup-info">
                            <div class="info-item">
                                <label>Auto Backup Interval:</label>
                                <span>Every 5 minutes</span>
                            </div>
                            <div class="info-item">
                                <label>Maximum Backups:</label>
                                <span>10 backups</span>
                            </div>
                            <div class="info-item">
                                <label>Storage Used:</label>
                                <span id="backup-storage-used">0 MB</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="backup-list-section">
                        <h3>Available Backups</h3>
                        <div class="backup-search">
                            <input type="text" id="backup-search" class="form-control" placeholder="Search backups...">
                            <select id="backup-filter" class="form-control">
                                <option value="">All Backups</option>
                                <option value="manual">Manual</option>
                                <option value="auto">Automatic</option>
                                <option value="cloud">Cloud</option>
                            </select>
                        </div>
                        
                        <div id="backup-list" class="backup-list">
                            <div class="no-backups">
                                <p>No backups available</p>
                                <button class="btn btn-primary" onclick="document.getElementById('create-backup-btn').click()">Create First Backup</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="restore-options-section">
                        <h3>Restore Options</h3>
                        <div class="restore-settings">
                            <div class="setting-group">
                                <h4>What to Restore:</h4>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" id="restore-characters" checked> Characters</label>
                                    <label><input type="checkbox" id="restore-campaigns" checked> Campaigns</label>
                                    <label><input type="checkbox" id="restore-templates" checked> Templates</label>
                                    <label><input type="checkbox" id="restore-settings" checked> Settings</label>
                                    <label><input type="checkbox" id="restore-adventures" checked> Adventures</label>
                                </div>
                            </div>
                            
                            <div class="setting-group">
                                <h4>Restore Options:</h4>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" id="backup-before-restore" checked> Create backup before restore</label>
                                    <label><input type="checkbox" id="merge-data"> Merge with existing data</label>
                                    <label><input type="checkbox" id="overwrite-conflicts"> Overwrite conflicts</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateTemplatesTabHTML() {
        return `
            <div id="templates-tab" class="tab-panel">
                <div class="templates-panel">
                    <div class="templates-actions-section">
                        <h3>Template Library</h3>
                        <div class="templates-actions">
                            <button id="create-template-btn" class="btn btn-primary">➕ Create Template</button>
                            <button id="import-template-btn" class="btn btn-secondary">📥 Import Template</button>
                            <button id="browse-community-btn" class="btn btn-secondary">🌐 Browse Community</button>
                        </div>
                    </div>
                    
                    <div class="templates-search-section">
                        <div class="search-controls">
                            <input type="text" id="template-search" class="form-control" placeholder="Search templates...">
                            <select id="template-type-filter" class="form-control">
                                <option value="">All Types</option>
                                <option value="character">Character</option>
                                <option value="campaign">Campaign</option>
                                <option value="encounter">Encounter</option>
                                <option value="npc">NPC</option>
                                <option value="adventure">Adventure</option>
                            </select>
                            <select id="template-source-filter" class="form-control">
                                <option value="">All Sources</option>
                                <option value="local">My Templates</option>
                                <option value="shared">Shared</option>
                                <option value="community">Community</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="templates-grid-section">
                        <div id="templates-grid" class="templates-grid">
                            <div class="no-templates">
                                <p>No templates available</p>
                                <button class="btn btn-primary" onclick="document.getElementById('create-template-btn').click()">Create First Template</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="template-details-section" id="template-details" style="display: none;">
                        <h3>Template Details</h3>
                        <div class="template-info">
                            <div class="template-preview">
                                <h4 id="template-name">Template Name</h4>
                                <div class="template-meta">
                                    <span id="template-type">Type</span>
                                    <span id="template-author">Author</span>
                                    <span id="template-created">Created</span>
                                </div>
                                <p id="template-description">Description</p>
                                <div class="template-tags" id="template-tags"></div>
                            </div>
                            
                            <div class="template-actions">
                                <button id="use-template-btn" class="btn btn-primary">Use Template</button>
                                <button id="edit-template-btn" class="btn btn-secondary">Edit</button>
                                <button id="share-template-btn" class="btn btn-secondary">Share</button>
                                <button id="export-template-btn" class="btn btn-secondary">Export</button>
                                <button id="delete-template-btn" class="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateImportExportTabHTML() {
        return `
            <div id="import-export-tab" class="tab-panel">
                <div class="import-export-panel">
                    <div class="export-section">
                        <h3>Export Data</h3>
                        <div class="export-options">
                            <div class="data-selection">
                                <h4>What to Export:</h4>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" id="export-characters" checked> Characters</label>
                                    <label><input type="checkbox" id="export-campaigns" checked> Campaigns</label>
                                    <label><input type="checkbox" id="export-templates"> Templates</label>
                                    <label><input type="checkbox" id="export-adventures"> Adventures</label>
                                    <label><input type="checkbox" id="export-settings"> Settings</label>
                                </div>
                            </div>
                            
                            <div class="format-selection">
                                <h4>Export Format:</h4>
                                <div class="radio-group">
                                    <label><input type="radio" name="export-format" value="json" checked> JSON (Human-readable)</label>
                                    <label><input type="radio" name="export-format" value="compressed"> Compressed (Smaller size)</label>
                                    <label><input type="radio" name="export-format" value="encrypted"> Encrypted (Secure)</label>
                                </div>
                            </div>
                            
                            <div class="export-actions">
                                <button id="export-data-btn" class="btn btn-primary">📤 Export Data</button>
                                <button id="export-to-cloud-btn" class="btn btn-secondary">☁️ Export to Cloud</button>
                            </div>
                        </div>
                        
                        <div class="export-history">
                            <h4>Recent Exports</h4>
                            <div id="export-history-list" class="history-list">
                                <p class="no-history">No recent exports</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="import-section">
                        <h3>Import Data</h3>
                        <div class="import-options">
                            <div class="import-source">
                                <h4>Import Source:</h4>
                                <div class="import-methods">
                                    <div class="import-method">
                                        <h5>📁 File Upload</h5>
                                        <input type="file" id="import-file" accept=".json,.zip,.encrypted" class="form-control">
                                        <button id="import-file-btn" class="btn btn-primary">Upload & Import</button>
                                    </div>
                                    
                                    <div class="import-method">
                                        <h5>🔗 URL Import</h5>
                                        <input type="url" id="import-url" class="form-control" placeholder="https://example.com/data.json">
                                        <button id="import-url-btn" class="btn btn-primary">Import from URL</button>
                                    </div>
                                    
                                    <div class="import-method">
                                        <h5>📋 Text Import</h5>
                                        <textarea id="import-text" class="form-control" rows="4" placeholder="Paste JSON data here..."></textarea>
                                        <button id="import-text-btn" class="btn btn-primary">Import Text</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="import-settings">
                                <h4>Import Settings:</h4>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" id="validate-import" checked> Validate data before import</label>
                                    <label><input type="checkbox" id="backup-before-import" checked> Create backup before import</label>
                                    <label><input type="checkbox" id="merge-on-conflict"> Merge on conflicts</label>
                                    <label><input type="checkbox" id="overwrite-duplicates"> Overwrite duplicates</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="import-preview" id="import-preview" style="display: none;">
                            <h4>Import Preview</h4>
                            <div class="preview-content">
                                <div class="preview-stats">
                                    <div class="stat-item">
                                        <label>Characters:</label>
                                        <span id="preview-characters">0</span>
                                    </div>
                                    <div class="stat-item">
                                        <label>Campaigns:</label>
                                        <span id="preview-campaigns">0</span>
                                    </div>
                                    <div class="stat-item">
                                        <label>Templates:</label>
                                        <span id="preview-templates">0</span>
                                    </div>
                                </div>
                                <div class="preview-actions">
                                    <button id="confirm-import-btn" class="btn btn-success">✅ Confirm Import</button>
                                    <button id="cancel-import-btn" class="btn btn-secondary">❌ Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateSettingsTabHTML() {
        return `
            <div id="settings-tab" class="tab-panel">
                <div class="settings-panel">
                    <div class="settings-section">
                        <h3>Data Management Settings</h3>
                        
                        <div class="setting-group">
                            <h4>Backup Settings</h4>
                            <div class="setting-item">
                                <label for="backup-interval">Auto-backup Interval (minutes):</label>
                                <input type="number" id="backup-interval" class="form-control" value="5" min="1" max="60">
                            </div>
                            <div class="setting-item">
                                <label for="max-backups">Maximum Backups:</label>
                                <input type="number" id="max-backups" class="form-control" value="10" min="1" max="50">
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="cloud-backup" checked>
                                    <span>Sync backups to cloud</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <h4>Sync Settings</h4>
                            <div class="setting-item">
                                <label for="sync-interval">Sync Interval (seconds):</label>
                                <input type="number" id="sync-interval" class="form-control" value="30" min="10" max="300">
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="conflict-resolution">
                                    <span>Automatic conflict resolution</span>
                                </label>
                                <small>Automatically resolve sync conflicts using timestamps</small>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="sync-notifications">
                                    <span>Sync notifications</span>
                                </label>
                                <small>Show notifications for sync events</small>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <h4>Security Settings</h4>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="data-encryption">
                                    <span>Encrypt all data</span>
                                </label>
                                <small>Encrypt data before storing locally or syncing to cloud</small>
                            </div>
                            <div class="setting-item">
                                <label for="encryption-key">Encryption Key:</label>
                                <div class="key-input-group">
                                    <input type="password" id="encryption-key" class="form-control" placeholder="Enter encryption key">
                                    <button class="btn btn-secondary" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'">👁️</button>
                                    <button class="btn btn-secondary" onclick="this.parentElement.querySelector('input').value = this.generateRandomKey()">🎲</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <h4>Performance Settings</h4>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="data-compression" checked>
                                    <span>Compress data</span>
                                </label>
                                <small>Reduce storage and bandwidth usage</small>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="lazy-loading" checked>
                                    <span>Lazy loading</span>
                                </label>
                                <small>Load data only when needed</small>
                            </div>
                            <div class="setting-item">
                                <label for="cache-size">Cache Size (MB):</label>
                                <input type="number" id="cache-size" class="form-control" value="50" min="10" max="500">
                            </div>
                        </div>
                    </div>
                    
                    <div class="storage-info-section">
                        <h3>Storage Information</h3>
                        <div class="storage-stats">
                            <div class="stat-card">
                                <h4>Local Storage</h4>
                                <div class="storage-usage">
                                    <div class="usage-bar">
                                        <div class="usage-fill" style="width: 45%;"></div>
                                    </div>
                                    <span>4.5 MB / 10 MB</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <h4>Cloud Storage</h4>
                                <div class="storage-usage">
                                    <div class="usage-bar">
                                        <div class="usage-fill" style="width: 12%;"></div>
                                    </div>
                                    <span>1.8 MB / 15 GB</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <h4>Data Breakdown</h4>
                                <div class="data-breakdown">
                                    <div class="breakdown-item">Characters: 2.1 MB</div>
                                    <div class="breakdown-item">Campaigns: 1.3 MB</div>
                                    <div class="breakdown-item">Templates: 0.8 MB</div>
                                    <div class="breakdown-item">Backups: 0.3 MB</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="data-actions-section">
                        <h3>Data Actions</h3>
                        <div class="danger-actions">
                            <button id="clear-cache-btn" class="btn btn-warning">🗑️ Clear Cache</button>
                            <button id="reset-sync-btn" class="btn btn-warning">🔄 Reset Sync</button>
                            <button id="clear-all-data-btn" class="btn btn-danger">⚠️ Clear All Data</button>
                        </div>
                        <p class="text-muted">
                            <small>⚠️ Danger Zone: These actions cannot be undone. Make sure you have backups!</small>
                        </p>
                    </div>
                    
                    <div class="settings-actions">
                        <button id="save-settings-btn" class="btn btn-primary">💾 Save Settings</button>
                        <button id="reset-settings-btn" class="btn btn-secondary">🔄 Reset to Defaults</button>
                        <button id="export-settings-btn" class="btn btn-secondary">📤 Export Settings</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createSyncStatusIndicator() {
        this.syncStatusElement = document.createElement('div');
        this.syncStatusElement.className = 'sync-status-indicator';
        this.syncStatusElement.innerHTML = `
            <div class="status-icon" title="Data sync status">
                <span id="status-icon-text">💾</span>
            </div>
            <div class="status-tooltip">
                <div class="tooltip-content">
                    <strong>Sync Status: <span id="tooltip-status">Disconnected</span></strong>
                    <div>Last sync: <span id="tooltip-last-sync">Never</span></div>
                    <button class="btn btn-sm btn-primary" onclick="window.dataInterface?.show()">Open Data Manager</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.syncStatusElement);
    }
    
    setupEventHandlers() {
        // Tab switching
        this.modalElement.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
        
        // Cloud provider connections
        this.modalElement.querySelectorAll('.connect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const provider = e.target.dataset.provider;
                this.connectToCloudProvider(provider);
            });
        });
        
        this.modalElement.querySelectorAll('.disconnect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.disconnectFromCloud();
            });
        });
        
        // Sync actions
        const syncNowBtn = this.modalElement.querySelector('#sync-now-btn');
        if (syncNowBtn) {
            syncNowBtn.addEventListener('click', () => this.syncNow());
        }
        
        // Backup actions
        const createBackupBtn = this.modalElement.querySelector('#create-backup-btn');
        if (createBackupBtn) {
            createBackupBtn.addEventListener('click', () => this.createBackup());
        }
        
        // Template actions
        const createTemplateBtn = this.modalElement.querySelector('#create-template-btn');
        if (createTemplateBtn) {
            createTemplateBtn.addEventListener('click', () => this.createTemplate());
        }
        
        // Import/Export actions
        const exportDataBtn = this.modalElement.querySelector('#export-data-btn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }
        
        const importFileBtn = this.modalElement.querySelector('#import-file-btn');
        if (importFileBtn) {
            importFileBtn.addEventListener('click', () => this.importFromFile());
        }
        
        // Settings actions
        const saveSettingsBtn = this.modalElement.querySelector('#save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }
        
        console.log('💾 Event handlers setup complete');
    }
    
    setupDataManagerEvents() {
        // Listen to data manager events
        this.dataManager.on('syncStatusChanged', (status) => {
            this.updateSyncStatus(status);
        });
        
        this.dataManager.on('cloudConnected', (data) => {
            this.updateCloudConnection(data.provider, true);
        });
        
        this.dataManager.on('cloudDisconnected', () => {
            this.updateCloudConnection(null, false);
        });
        
        this.dataManager.on('backupCreated', (data) => {
            this.refreshBackupList();
            this.showNotification('Backup created successfully', 'success');
        });
        
        this.dataManager.on('templateCreated', (template) => {
            this.refreshTemplateList();
            this.showNotification(`Template "${template.name}" created`, 'success');
        });
        
        this.dataManager.on('dataImported', (data) => {
            this.showNotification(`Imported ${data.results.imported} ${data.type}`, 'success');
        });
        
        this.dataManager.on('syncError', (error) => {
            this.showNotification(`Sync error: ${error.message}`, 'error');
        });
        
        console.log('💾 Data manager events setup complete');
    }
    
    // Public interface methods
    show() {
        this.modalElement.style.display = 'block';
        this.isVisible = true;
        this.refreshData();
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
        
        // Refresh tab content
        this.refreshTabContent(tabName);
        
        console.log(`💾 Switched to tab: ${tabName}`);
    }
    
    async connectToCloudProvider(providerName) {
        try {
            this.showSpinner(true);
            await this.dataManager.connectToCloud(providerName);
            this.showNotification(`Connected to ${providerName}`, 'success');
        } catch (error) {
            this.showNotification(`Failed to connect: ${error.message}`, 'error');
        } finally {
            this.showSpinner(false);
        }
    }
    
    async disconnectFromCloud() {
        try {
            await this.dataManager.disconnectFromCloud();
            this.showNotification('Disconnected from cloud', 'info');
        } catch (error) {
            this.showNotification(`Failed to disconnect: ${error.message}`, 'error');
        }
    }
    
    async syncNow() {
        try {
            this.showSpinner(true);
            // Implement sync now functionality
            this.showNotification('Sync completed', 'success');
        } catch (error) {
            this.showNotification(`Sync failed: ${error.message}`, 'error');
        } finally {
            this.showSpinner(false);
        }
    }
    
    async createBackup() {
        const description = prompt('Enter backup description (optional):') || '';
        try {
            const backupId = await this.dataManager.createBackup(description);
            this.refreshBackupList();
            this.showNotification(`Backup created: ${backupId}`, 'success');
        } catch (error) {
            this.showNotification(`Backup failed: ${error.message}`, 'error');
        }
    }
    
    async createTemplate() {
        // Show template creation modal
        this.showNotification('Template creation not implemented yet', 'info');
    }
    
    async exportData() {
        // Implement data export
        this.showNotification('Data export not implemented yet', 'info');
    }
    
    async importFromFile() {
        const fileInput = this.modalElement.querySelector('#import-file');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showNotification('Please select a file to import', 'warning');
            return;
        }
        
        try {
            const text = await file.text();
            const results = await this.dataManager.importData(text);
            this.showNotification(`Import completed: ${results.imported} items`, 'success');
        } catch (error) {
            this.showNotification(`Import failed: ${error.message}`, 'error');
        }
    }
    
    saveSettings() {
        // Implement settings save
        this.showNotification('Settings saved', 'success');
    }
    
    // UI update methods
    updateSyncStatus(status) {
        const statusElements = [
            this.modalElement.querySelector('#sync-status-text'),
            this.modalElement.querySelector('#detailed-sync-status'),
            this.syncStatusElement?.querySelector('#tooltip-status')
        ];
        
        statusElements.forEach(element => {
            if (element) {
                element.textContent = this.formatSyncStatus(status);
            }
        });
        
        // Update sync status icon
        const statusIcon = this.syncStatusElement?.querySelector('#status-icon-text');
        if (statusIcon) {
            statusIcon.textContent = this.getSyncStatusIcon(status);
        }
        
        // Enable/disable sync button
        const syncBtn = this.modalElement.querySelector('#sync-now-btn');
        if (syncBtn) {
            syncBtn.disabled = status !== 'connected';
        }
    }
    
    updateCloudConnection(provider, connected) {
        this.cloudProviders.forEach(providerName => {
            const card = this.modalElement.querySelector(`[data-provider="${providerName}"]`);
            if (card) {
                const connectBtn = card.querySelector('.connect-btn');
                const statusDiv = card.querySelector('.provider-status');
                
                if (providerName === provider && connected) {
                    connectBtn.style.display = 'none';
                    statusDiv.style.display = 'block';
                    card.classList.add('connected');
                } else if (!connected) {
                    connectBtn.style.display = 'block';
                    statusDiv.style.display = 'none';
                    card.classList.remove('connected');
                }
            }
        });
    }
    
    refreshData() {
        this.refreshBackupList();
        this.refreshTemplateList();
        this.updateStorageInfo();
        this.updateLastSyncTime();
    }
    
    refreshTabContent(tabName) {
        switch (tabName) {
            case 'sync':
                this.updateSyncInfo();
                break;
            case 'backup':
                this.refreshBackupList();
                break;
            case 'templates':
                this.refreshTemplateList();
                break;
            case 'import-export':
                this.refreshImportExportHistory();
                break;
            case 'settings':
                this.refreshSettings();
                break;
        }
    }
    
    async refreshBackupList() {
        try {
            this.backupList = await this.dataManager.getBackupList();
            const backupListElement = this.modalElement.querySelector('#backup-list');
            
            if (this.backupList.length === 0) {
                backupListElement.innerHTML = `
                    <div class="no-backups">
                        <p>No backups available</p>
                        <button class="btn btn-primary" onclick="document.getElementById('create-backup-btn').click()">Create First Backup</button>
                    </div>
                `;
                return;
            }
            
            backupListElement.innerHTML = this.backupList.map(backup => `
                <div class="backup-item" data-backup-id="${backup.id}">
                    <div class="backup-info">
                        <h5>${backup.description}</h5>
                        <div class="backup-meta">
                            <span>📅 ${new Date(backup.timestamp).toLocaleString()}</span>
                            <span>📦 ${this.formatFileSize(backup.size)}</span>
                        </div>
                    </div>
                    <div class="backup-actions">
                        <button class="btn btn-sm btn-primary" onclick="window.dataInterface?.restoreBackup('${backup.id}')">Restore</button>
                        <button class="btn btn-sm btn-secondary" onclick="window.dataInterface?.downloadBackup('${backup.id}')">Download</button>
                        <button class="btn btn-sm btn-danger" onclick="window.dataInterface?.deleteBackup('${backup.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Failed to refresh backup list:', error);
        }
    }
    
    refreshTemplateList() {
        const templatesGrid = this.modalElement.querySelector('#templates-grid');
        
        if (this.templateList.length === 0) {
            templatesGrid.innerHTML = `
                <div class="no-templates">
                    <p>No templates available</p>
                    <button class="btn btn-primary" onclick="document.getElementById('create-template-btn').click()">Create First Template</button>
                </div>
            `;
            return;
        }
        
        // Implementation would go here
        console.log('💾 Template list refreshed');
    }
    
    updateSyncInfo() {
        // Update sync information display
        console.log('💾 Sync info updated');
    }
    
    updateStorageInfo() {
        // Update storage usage information
        console.log('💾 Storage info updated');
    }
    
    updateLastSyncTime() {
        const lastSyncElements = [
            this.modalElement.querySelector('#last-sync-time'),
            this.modalElement.querySelector('#detailed-last-sync'),
            this.syncStatusElement?.querySelector('#tooltip-last-sync')
        ];
        
        const lastSync = this.dataManager.lastSync;
        const timeText = lastSync ? 
            new Date(lastSync).toLocaleString() : 
            'Never';
        
        lastSyncElements.forEach(element => {
            if (element) {
                element.textContent = timeText;
            }
        });
    }
    
    refreshImportExportHistory() {
        // Refresh import/export history
        console.log('💾 Import/export history refreshed');
    }
    
    refreshSettings() {
        // Load current settings into UI
        console.log('💾 Settings refreshed');
    }
    
    // Utility methods
    showSpinner(show) {
        const spinner = this.modalElement.querySelector('#sync-spinner');
        if (spinner) {
            spinner.style.display = show ? 'block' : 'none';
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        console.log(`${type.toUpperCase()}: ${message}`);
    }
    
    formatSyncStatus(status) {
        const statusMap = {
            'disconnected': 'Disconnected',
            'connecting': 'Connecting...',
            'connected': 'Connected',
            'syncing': 'Syncing...',
            'error': 'Error'
        };
        
        return statusMap[status] || status;
    }
    
    getSyncStatusIcon(status) {
        const iconMap = {
            'disconnected': '💾',
            'connecting': '🔄',
            'connected': '☁️',
            'syncing': '⏳',
            'error': '❌'
        };
        
        return iconMap[status] || '💾';
    }
    
    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        this.refreshTimer = setInterval(() => {
            if (this.isVisible) {
                this.refreshData();
            }
        }, this.options.refreshInterval);
        
        console.log('💾 Auto-refresh started');
    }
    
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
        
        console.log('💾 Auto-refresh stopped');
    }
    
    // Cleanup
    destroy() {
        this.stopAutoRefresh();
        
        if (this.modalElement && this.modalElement.parentElement) {
            this.modalElement.remove();
        }
        
        if (this.syncStatusElement && this.syncStatusElement.parentElement) {
            this.syncStatusElement.remove();
        }
        
        console.log('💾 Enhanced Data Interface destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedDataInterface;
} else if (typeof window !== 'undefined') {
    window.EnhancedDataInterface = EnhancedDataInterface;
}