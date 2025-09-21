/**
 * Multi-Platform Export Interface
 * User-friendly interface for character export functionality
 * providing format selection, preview, batch operations, and export management
 * 
 * Features:
 * - Export format selection with previews
 * - Batch export wizard
 * - Export history and management
 * - Custom template configuration
 * - Real-time export progress
 * - Download management
 * - Cloud service integration UI
 * - Import validation interface
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class MultiPlatformExportInterface {
    constructor(exporter, gamingInterface, options = {}) {
        this.exporter = exporter;
        this.gamingInterface = gamingInterface;
        
        this.options = {
            defaultFormat: options.defaultFormat || 'json',
            showPreview: options.showPreview !== false,
            enableBatchExport: options.enableBatchExport !== false,
            maxBatchSize: options.maxBatchSize || 10,
            showProgress: options.showProgress !== false,
            autoDownload: options.autoDownload !== false,
            ...options
        };
        
        this.currentCharacter = null;
        this.selectedFormats = new Set([this.options.defaultFormat]);
        this.exportQueue = [];
        this.activeExports = new Map();
        this.downloadUrls = new Map();
        
        this.initialize();
        
        console.log('📤 Multi-Platform Export Interface initialized');
    }
    
    initialize() {
        this.createExportInterface();
        this.setupEventHandlers();
        this.loadExportPreferences();
        
        console.log('📤 Export interface ready');
    }
    
    createExportInterface() {
        const exportPanel = document.createElement('div');
        exportPanel.className = 'export-interface-panel';
        exportPanel.id = 'exportPanel';
        
        exportPanel.innerHTML = `
            <div class="export-header">
                <h2 class="export-title">Export Character</h2>
                <div class="export-subtitle">Choose formats and options for character export</div>
            </div>
            
            <div class="export-content">
                <!-- Character Selection Section -->
                <div class="export-section character-selection" id="characterSelectionSection">
                    <h3 class="section-title">Character Selection</h3>
                    <div class="character-selector">
                        <select id="characterSelect" class="character-select" aria-label="Select character to export">
                            <option value="">Select a character...</option>
                        </select>
                        <div class="character-info" id="characterInfo" style="display: none;">
                            <div class="character-preview">
                                <img id="characterPortrait" class="character-portrait" alt="Character portrait" />
                                <div class="character-details">
                                    <div class="character-name" id="characterName">Character Name</div>
                                    <div class="character-meta" id="characterMeta">Level 1 Human Fighter</div>
                                    <div class="character-stats" id="characterStats">
                                        <span class="stat">HP: <span id="characterHP">0</span></span>
                                        <span class="stat">AC: <span id="characterAC">10</span></span>
                                        <span class="stat">XP: <span id="characterXP">0</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Format Selection Section -->
                <div class="export-section format-selection" id="formatSelectionSection">
                    <h3 class="section-title">Export Formats</h3>
                    <div class="format-grid" id="formatGrid">
                        <!-- Format cards will be dynamically generated -->
                    </div>
                    <div class="format-details" id="formatDetails" style="display: none;">
                        <h4>Format Details</h4>
                        <div class="format-description" id="formatDescription"></div>
                        <div class="format-options" id="formatOptions"></div>
                    </div>
                </div>
                
                <!-- Export Options Section -->
                <div class="export-section export-options" id="exportOptionsSection">
                    <h3 class="section-title">Export Options</h3>
                    <div class="options-grid">
                        <div class="option-group">
                            <h4>Content Options</h4>
                            <label class="option-checkbox">
                                <input type="checkbox" id="includePortrait" checked>
                                <span>Include Character Portrait</span>
                            </label>
                            <label class="option-checkbox">
                                <input type="checkbox" id="includeEquipment" checked>
                                <span>Include Equipment</span>
                            </label>
                            <label class="option-checkbox">
                                <input type="checkbox" id="includeSpells" checked>
                                <span>Include Spells</span>
                            </label>
                            <label class="option-checkbox">
                                <input type="checkbox" id="includeNotes" checked>
                                <span>Include Notes & Background</span>
                            </label>
                            <label class="option-checkbox">
                                <input type="checkbox" id="includeMetadata">
                                <span>Include Export Metadata</span>
                            </label>
                        </div>
                        
                        <div class="option-group">
                            <h4>Format Options</h4>
                            <label class="option-select">
                                <span>Compression:</span>
                                <select id="compressionLevel">
                                    <option value="none">None</option>
                                    <option value="light">Light</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </label>
                            <label class="option-select">
                                <span>Date Format:</span>
                                <select id="dateFormat">
                                    <option value="iso" selected>ISO 8601</option>
                                    <option value="us">US Format</option>
                                    <option value="eu">European Format</option>
                                    <option value="timestamp">Unix Timestamp</option>
                                </select>
                            </label>
                            <label class="option-checkbox">
                                <input type="checkbox" id="prettyPrint">
                                <span>Pretty Print JSON/XML</span>
                            </label>
                        </div>
                        
                        <div class="option-group">
                            <h4>Privacy Options</h4>
                            <label class="option-checkbox">
                                <input type="checkbox" id="excludePersonalInfo">
                                <span>Exclude Personal Information</span>
                            </label>
                            <label class="option-checkbox">
                                <input type="checkbox" id="excludeInternalIds">
                                <span>Exclude Internal IDs</span>
                            </label>
                            <label class="option-checkbox">
                                <input type="checkbox" id="anonymizeData">
                                <span>Anonymize Character Data</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Preview Section -->
                <div class="export-section preview-section" id="previewSection" style="display: none;">
                    <h3 class="section-title">Export Preview</h3>
                    <div class="preview-container">
                        <div class="preview-tabs" id="previewTabs">
                            <!-- Preview tabs will be dynamically generated -->
                        </div>
                        <div class="preview-content" id="previewContent">
                            <div class="preview-placeholder">
                                Select a format to see preview
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Batch Export Section -->
                <div class="export-section batch-section" id="batchSection" style="display: none;">
                    <h3 class="section-title">Batch Export</h3>
                    <div class="batch-controls">
                        <button type="button" id="enableBatchMode" class="batch-toggle-btn">
                            Enable Batch Mode
                        </button>
                        <div class="batch-character-list" id="batchCharacterList" style="display: none;">
                            <!-- Batch character selection -->
                        </div>
                    </div>
                </div>
                
                <!-- Progress Section -->
                <div class="export-section progress-section" id="progressSection" style="display: none;">
                    <h3 class="section-title">Export Progress</h3>
                    <div class="progress-container">
                        <div class="progress-bar-container">
                            <div class="progress-bar" id="exportProgressBar">
                                <div class="progress-fill" id="exportProgressFill"></div>
                            </div>
                            <div class="progress-text" id="exportProgressText">Ready to export</div>
                        </div>
                        <div class="export-log" id="exportLog">
                            <!-- Export progress messages -->
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="export-actions">
                <div class="action-buttons">
                    <button type="button" id="previewExport" class="action-btn secondary-btn" disabled>
                        <span class="btn-icon">👁️</span>
                        <span class="btn-text">Preview</span>
                    </button>
                    <button type="button" id="startExport" class="action-btn primary-btn" disabled>
                        <span class="btn-icon">📤</span>
                        <span class="btn-text">Export</span>
                    </button>
                    <button type="button" id="cancelExport" class="action-btn danger-btn" style="display: none;">
                        <span class="btn-icon">✖️</span>
                        <span class="btn-text">Cancel</span>
                    </button>
                </div>
                
                <div class="export-summary" id="exportSummary">
                    <div class="summary-item">
                        <span class="summary-label">Selected Formats:</span>
                        <span class="summary-value" id="selectedFormatsCount">0</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Estimated Size:</span>
                        <span class="summary-value" id="estimatedSize">0 KB</span>
                    </div>
                </div>
            </div>
            
            <!-- Export History Section -->
            <div class="export-section history-section" id="historySection">
                <div class="section-header">
                    <h3 class="section-title">Export History</h3>
                    <button type="button" id="clearHistory" class="clear-history-btn">Clear History</button>
                </div>
                <div class="history-container" id="historyContainer">
                    <div class="history-placeholder">No export history yet</div>
                </div>
            </div>
        `;
        
        // Find the export panel in the main UI and replace it
        const existingPanel = document.querySelector('#panel-export .card-body');
        if (existingPanel) {
            existingPanel.innerHTML = '';
            existingPanel.appendChild(exportPanel);
        } else {
            // Create as modal if no panel exists
            this.showExportModal(exportPanel);
        }
        
        this.exportPanel = exportPanel;
        
        // Initialize format cards
        this.createFormatCards();
        
        // Load available characters
        this.loadAvailableCharacters();
        
        // Load export history
        this.loadExportHistory();
    }
    
    createFormatCards() {
        const formatGrid = this.exportPanel.querySelector('#formatGrid');
        formatGrid.innerHTML = '';
        
        this.exporter.supportedFormats.forEach((formatInfo, formatId) => {
            const card = this.createElement('div', {
                className: 'format-card',
                'data-format': formatId
            });
            
            const isSelected = this.selectedFormats.has(formatId);
            if (isSelected) {
                card.classList.add('selected');
            }
            
            card.innerHTML = `
                <div class="format-card-header">
                    <div class="format-icon">${this.getFormatIcon(formatId)}</div>
                    <div class="format-checkbox">
                        <input type="checkbox" id="format-${formatId}" ${isSelected ? 'checked' : ''} 
                               aria-label="Select ${formatInfo.name}">
                    </div>
                </div>
                <div class="format-card-body">
                    <div class="format-name">${formatInfo.name}</div>
                    <div class="format-extension">${formatInfo.extension}</div>
                    <div class="format-description">${this.getFormatDescription(formatId)}</div>
                </div>
                <div class="format-card-footer">
                    <div class="format-compatibility">
                        ${this.getCompatibilityBadges(formatId).map(badge => 
                            `<span class="compatibility-badge ${badge.type}">${badge.name}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
            
            formatGrid.appendChild(card);
        });
    }
    
    getFormatIcon(formatId) {
        const icons = {
            pdf: '📄',
            json: '🔧',
            png: '🖼️',
            roll20: '🎲',
            dndbeyond: '🐉',
            xml: '📋',
            csv: '📊',
            foundry: '🏰',
            pcgen: '⚡',
            herolab: '🦸'
        };
        return icons[formatId] || '📁';
    }
    
    getFormatDescription(formatId) {
        const descriptions = {
            pdf: 'Official D&D 3.5 character sheet format',
            json: 'Complete character data in JSON format',
            png: 'Character portrait with stats overlay',
            roll20: 'Roll20 virtual tabletop import format',
            dndbeyond: 'D&D Beyond compatible character data',
            xml: 'Structured XML data format',
            csv: 'Spreadsheet-compatible comma-separated values',
            foundry: 'Foundry Virtual Tabletop character actor',
            pcgen: 'PCGen character generator format',
            herolab: 'Hero Lab portfolio format'
        };
        return descriptions[formatId] || 'Character export format';
    }
    
    getCompatibilityBadges(formatId) {
        const compatibility = {
            pdf: [{ name: 'Print', type: 'print' }, { name: 'Universal', type: 'universal' }],
            json: [{ name: 'Universal', type: 'universal' }, { name: 'Developer', type: 'developer' }],
            png: [{ name: 'Social', type: 'social' }, { name: 'Visual', type: 'visual' }],
            roll20: [{ name: 'VTT', type: 'vtt' }],
            dndbeyond: [{ name: 'Official', type: 'official' }],
            xml: [{ name: 'Universal', type: 'universal' }, { name: 'Developer', type: 'developer' }],
            csv: [{ name: 'Spreadsheet', type: 'spreadsheet' }],
            foundry: [{ name: 'VTT', type: 'vtt' }],
            pcgen: [{ name: 'Generator', type: 'generator' }],
            herolab: [{ name: 'Generator', type: 'generator' }]
        };
        return compatibility[formatId] || [];
    }
    
    setupEventHandlers() {
        const panel = this.exportPanel;
        
        // Character selection
        const characterSelect = panel.querySelector('#characterSelect');
        characterSelect.addEventListener('change', (e) => {
            this.selectCharacter(e.target.value);
        });
        
        // Format selection
        panel.addEventListener('change', (e) => {
            if (e.target.matches('[id^="format-"]')) {
                const formatId = e.target.id.replace('format-', '');
                this.toggleFormatSelection(formatId, e.target.checked);
            }
        });
        
        // Format card clicks
        panel.addEventListener('click', (e) => {
            const formatCard = e.target.closest('.format-card');
            if (formatCard && !e.target.matches('input')) {
                const checkbox = formatCard.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        
        // Preview button
        const previewBtn = panel.querySelector('#previewExport');
        previewBtn.addEventListener('click', () => {
            this.showPreview();
        });
        
        // Export button
        const exportBtn = panel.querySelector('#startExport');
        exportBtn.addEventListener('click', () => {
            this.startExport();
        });
        
        // Cancel button
        const cancelBtn = panel.querySelector('#cancelExport');
        cancelBtn.addEventListener('click', () => {
            this.cancelExport();
        });
        
        // Batch mode toggle
        const batchToggle = panel.querySelector('#enableBatchMode');
        batchToggle.addEventListener('click', () => {
            this.toggleBatchMode();
        });
        
        // Clear history button
        const clearHistoryBtn = panel.querySelector('#clearHistory');
        clearHistoryBtn.addEventListener('click', () => {
            this.clearExportHistory();
        });
        
        // Options change handlers
        const optionInputs = panel.querySelectorAll('.export-options input, .export-options select');
        optionInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateExportOptions();
                this.updateEstimatedSize();
            });
        });
    }
    
    selectCharacter(characterId) {
        if (!characterId) {
            this.currentCharacter = null;
            this.updateCharacterInfo(null);
            this.updateActionButtons();
            return;
        }
        
        // Load character data (this would integrate with character manager)
        this.currentCharacter = this.loadCharacterById(characterId);
        this.updateCharacterInfo(this.currentCharacter);
        this.updateActionButtons();
        this.updateEstimatedSize();
        
        console.log(`📤 Selected character: ${this.currentCharacter?.name || 'Unknown'}`);
    }
    
    loadCharacterById(characterId) {
        // This would integrate with the character manager
        // For now, return mock data
        return {
            id: characterId,
            name: 'Thorin Ironforge',
            player: 'Player 1',
            characterClass: 'Fighter',
            level: 5,
            race: 'Dwarf',
            alignment: 'Lawful Good',
            portrait: { url: 'path/to/portrait.png' },
            abilities: {
                strength: { score: 16, modifier: 3 },
                dexterity: { score: 12, modifier: 1 },
                constitution: { score: 14, modifier: 2 },
                intelligence: { score: 10, modifier: 0 },
                wisdom: { score: 13, modifier: 1 },
                charisma: { score: 8, modifier: -1 }
            },
            hitPoints: { max: 45, current: 45 },
            armorClass: { total: 18 },
            experience: 10000
        };
    }
    
    updateCharacterInfo(character) {
        const characterInfo = this.exportPanel.querySelector('#characterInfo');
        
        if (!character) {
            characterInfo.style.display = 'none';
            return;
        }
        
        characterInfo.style.display = 'block';
        
        const portrait = characterInfo.querySelector('#characterPortrait');
        const name = characterInfo.querySelector('#characterName');
        const meta = characterInfo.querySelector('#characterMeta');
        const hp = characterInfo.querySelector('#characterHP');
        const ac = characterInfo.querySelector('#characterAC');
        const xp = characterInfo.querySelector('#characterXP');
        
        if (character.portrait?.url) {
            portrait.src = character.portrait.url;
            portrait.style.display = 'block';
        } else {
            portrait.style.display = 'none';
        }
        
        name.textContent = character.name || 'Unnamed Character';
        meta.textContent = `Level ${character.level || 1} ${character.race || 'Unknown'} ${character.characterClass || 'Unknown'}`;
        hp.textContent = character.hitPoints?.max || 0;
        ac.textContent = character.armorClass?.total || 10;
        xp.textContent = character.experience || 0;
    }
    
    toggleFormatSelection(formatId, selected) {
        if (selected) {
            this.selectedFormats.add(formatId);
        } else {
            this.selectedFormats.delete(formatId);
        }
        
        // Update format card appearance
        const card = this.exportPanel.querySelector(`[data-format="${formatId}"]`);
        if (card) {
            card.classList.toggle('selected', selected);
        }
        
        // Update summary
        this.updateSelectedFormatsSummary();
        this.updateActionButtons();
        this.updateEstimatedSize();
        
        console.log(`📤 Format ${formatId} ${selected ? 'selected' : 'deselected'}`);
    }
    
    updateSelectedFormatsSummary() {
        const countElement = this.exportPanel.querySelector('#selectedFormatsCount');
        countElement.textContent = this.selectedFormats.size;
    }
    
    updateActionButtons() {
        const previewBtn = this.exportPanel.querySelector('#previewExport');
        const exportBtn = this.exportPanel.querySelector('#startExport');
        
        const canExport = this.currentCharacter && this.selectedFormats.size > 0;
        
        previewBtn.disabled = !canExport;
        exportBtn.disabled = !canExport;
    }
    
    updateEstimatedSize() {
        if (!this.currentCharacter || this.selectedFormats.size === 0) {
            this.exportPanel.querySelector('#estimatedSize').textContent = '0 KB';
            return;
        }
        
        // Estimate file sizes based on format and character complexity
        let totalSize = 0;
        
        this.selectedFormats.forEach(formatId => {
            switch (formatId) {
                case 'pdf': totalSize += 150; break; // ~150KB for PDF
                case 'json': totalSize += 25; break; // ~25KB for JSON
                case 'png': totalSize += 200; break; // ~200KB for PNG
                case 'xml': totalSize += 35; break; // ~35KB for XML
                case 'csv': totalSize += 5; break; // ~5KB for CSV
                default: totalSize += 20; break; // Default ~20KB
            }
        });
        
        // Adjust based on included content
        const options = this.getExportOptions();
        if (options.includePortrait) totalSize += 50;
        if (options.includeEquipment) totalSize += 30;
        if (options.includeSpells) totalSize += 40;
        if (options.includeNotes) totalSize += 10;
        
        const sizeElement = this.exportPanel.querySelector('#estimatedSize');
        if (totalSize < 1024) {
            sizeElement.textContent = `${totalSize} KB`;
        } else {
            sizeElement.textContent = `${(totalSize / 1024).toFixed(1)} MB`;
        }
    }
    
    getExportOptions() {
        const panel = this.exportPanel;
        
        return {
            includePortrait: panel.querySelector('#includePortrait').checked,
            includeEquipment: panel.querySelector('#includeEquipment').checked,
            includeSpells: panel.querySelector('#includeSpells').checked,
            includeNotes: panel.querySelector('#includeNotes').checked,
            includeMetadata: panel.querySelector('#includeMetadata').checked,
            compressionLevel: panel.querySelector('#compressionLevel').value,
            dateFormat: panel.querySelector('#dateFormat').value,
            prettyPrint: panel.querySelector('#prettyPrint').checked,
            excludePersonalInfo: panel.querySelector('#excludePersonalInfo').checked,
            excludeInternalIds: panel.querySelector('#excludeInternalIds').checked,
            anonymizeData: panel.querySelector('#anonymizeData').checked
        };
    }
    
    async showPreview() {
        if (!this.currentCharacter || this.selectedFormats.size === 0) return;
        
        console.log('📤 Generating export preview...');
        
        const previewSection = this.exportPanel.querySelector('#previewSection');
        const previewTabs = previewSection.querySelector('#previewTabs');
        const previewContent = previewSection.querySelector('#previewContent');
        
        previewSection.style.display = 'block';
        
        // Clear existing tabs
        previewTabs.innerHTML = '';
        previewContent.innerHTML = '<div class="preview-loading">Generating preview...</div>';
        
        const options = this.getExportOptions();
        const previews = new Map();
        
        // Generate previews for selected formats
        for (const formatId of this.selectedFormats) {
            try {
                const exportResult = await this.exporter.exportCharacter(this.currentCharacter, formatId, options);
                if (exportResult.success) {
                    previews.set(formatId, exportResult.data);
                }
            } catch (error) {
                console.error(`Failed to generate preview for ${formatId}:`, error);
            }
        }
        
        // Create tabs
        let firstTab = true;
        previews.forEach((data, formatId) => {
            const tab = this.createElement('button', {
                className: `preview-tab ${firstTab ? 'active' : ''}`,
                'data-format': formatId
            });
            tab.textContent = this.exporter.supportedFormats.get(formatId).name;
            tab.addEventListener('click', () => this.showPreviewTab(formatId, data));
            previewTabs.appendChild(tab);
            
            if (firstTab) {
                this.showPreviewTab(formatId, data);
                firstTab = false;
            }
        });
    }
    
    showPreviewTab(formatId, data) {
        const previewContent = this.exportPanel.querySelector('#previewContent');
        const tabs = this.exportPanel.querySelectorAll('.preview-tab');
        
        // Update active tab
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-format') === formatId);
        });
        
        // Show preview content
        let previewHtml = '';
        
        switch (formatId) {
            case 'json':
            case 'xml':
                previewHtml = `<pre class="code-preview"><code>${this.escapeHtml(typeof data === 'string' ? data : JSON.stringify(data, null, 2))}</code></pre>`;
                break;
            case 'csv':
                previewHtml = `<div class="csv-preview"><table class="csv-table">${this.convertCsvToTable(data)}</table></div>`;
                break;
            case 'png':
                previewHtml = `<div class="image-preview"><img src="${data}" alt="Character export preview" /></div>`;
                break;
            case 'pdf':
                previewHtml = `<div class="pdf-preview"><div class="pdf-placeholder">PDF Preview<br><small>Click Export to download full PDF</small></div></div>`;
                break;
            default:
                previewHtml = `<div class="generic-preview">Preview for ${formatId} format<br><small>${typeof data === 'string' ? data.length : JSON.stringify(data).length} characters</small></div>`;
        }
        
        previewContent.innerHTML = previewHtml;
    }
    
    async startExport() {
        if (!this.currentCharacter || this.selectedFormats.size === 0) return;
        
        console.log('📤 Starting character export...');
        
        // Show progress section
        const progressSection = this.exportPanel.querySelector('#progressSection');
        progressSection.style.display = 'block';
        
        // Update buttons
        const exportBtn = this.exportPanel.querySelector('#startExport');
        const cancelBtn = this.exportPanel.querySelector('#cancelExport');
        exportBtn.style.display = 'none';
        cancelBtn.style.display = 'inline-flex';
        
        const options = this.getExportOptions();
        const totalFormats = this.selectedFormats.size;
        let completedFormats = 0;
        
        this.updateProgress(0, `Exporting to ${totalFormats} format${totalFormats > 1 ? 's' : ''}...`);
        
        const results = [];
        
        for (const formatId of this.selectedFormats) {
            try {
                this.updateProgress(
                    (completedFormats / totalFormats) * 100,
                    `Exporting ${formatId.toUpperCase()}...`
                );
                
                const exportResult = await this.exporter.exportCharacter(this.currentCharacter, formatId, options);
                
                if (exportResult.success && this.options.autoDownload) {
                    this.downloadExport(exportResult);
                }
                
                results.push(exportResult);
                completedFormats++;
                
                this.logExportMessage(`✅ ${formatId.toUpperCase()} export completed`);
                
            } catch (error) {
                console.error(`Export failed for ${formatId}:`, error);
                this.logExportMessage(`❌ ${formatId.toUpperCase()} export failed: ${error.message}`);
                
                results.push({
                    success: false,
                    format: formatId,
                    error: error.message
                });
            }
        }
        
        // Complete
        this.updateProgress(100, 'Export completed!');
        
        const successCount = results.filter(r => r.success).length;
        this.logExportMessage(`🎉 Export finished: ${successCount}/${totalFormats} successful`);
        
        // Reset buttons
        setTimeout(() => {
            exportBtn.style.display = 'inline-flex';
            cancelBtn.style.display = 'none';
        }, 2000);
        
        // Update history
        this.loadExportHistory();
        
        return results;
    }
    
    updateProgress(percent, message) {
        const progressFill = this.exportPanel.querySelector('#exportProgressFill');
        const progressText = this.exportPanel.querySelector('#exportProgressText');
        
        progressFill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        progressText.textContent = message;
    }
    
    logExportMessage(message) {
        const exportLog = this.exportPanel.querySelector('#exportLog');
        const logEntry = this.createElement('div', { className: 'log-entry' });
        logEntry.innerHTML = `
            <span class="log-time">${new Date().toLocaleTimeString()}</span>
            <span class="log-message">${message}</span>
        `;
        
        exportLog.appendChild(logEntry);
        exportLog.scrollTop = exportLog.scrollHeight;
    }
    
    downloadExport(exportResult) {
        if (!exportResult.downloadUrl) return;
        
        const link = document.createElement('a');
        link.href = exportResult.downloadUrl.url;
        link.download = exportResult.downloadUrl.filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Store download URL for later cleanup
        this.downloadUrls.set(exportResult.metadata.id, exportResult.downloadUrl);
        
        console.log(`📥 Downloaded: ${exportResult.downloadUrl.filename}`);
    }
    
    loadAvailableCharacters() {
        const characterSelect = this.exportPanel.querySelector('#characterSelect');
        
        // This would integrate with character manager to load actual characters
        // For now, add mock characters
        const mockCharacters = [
            { id: 'char1', name: 'Thorin Ironforge', class: 'Fighter', level: 5 },
            { id: 'char2', name: 'Elara Moonwhisper', class: 'Wizard', level: 3 },
            { id: 'char3', name: 'Gareth Stormwind', class: 'Paladin', level: 7 }
        ];
        
        characterSelect.innerHTML = '<option value="">Select a character...</option>';
        
        mockCharacters.forEach(character => {
            const option = document.createElement('option');
            option.value = character.id;
            option.textContent = `${character.name} (Level ${character.level} ${character.class})`;
            characterSelect.appendChild(option);
        });
    }
    
    loadExportHistory() {
        const historyContainer = this.exportPanel.querySelector('#historyContainer');
        const history = this.exporter.exportHistory;
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<div class="history-placeholder">No export history yet</div>';
            return;
        }
        
        historyContainer.innerHTML = '';
        
        history.slice(0, 10).forEach(record => {
            const historyItem = this.createElement('div', {
                className: `history-item ${record.success ? 'success' : 'failed'}`
            });
            
            historyItem.innerHTML = `
                <div class="history-icon">${record.success ? '✅' : '❌'}</div>
                <div class="history-details">
                    <div class="history-character">${record.characterName}</div>
                    <div class="history-format">${record.format.toUpperCase()}</div>
                    <div class="history-time">${new Date(record.timestamp).toLocaleString()}</div>
                    ${record.error ? `<div class="history-error">${record.error}</div>` : ''}
                </div>
                <div class="history-actions">
                    ${record.success ? `<button class="history-redownload" data-id="${record.id}">⬇️</button>` : ''}
                    <button class="history-delete" data-id="${record.id}">🗑️</button>
                </div>
            `;
            
            historyContainer.appendChild(historyItem);
        });
        
        // Add event handlers for history actions
        historyContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-redownload')) {
                const recordId = e.target.getAttribute('data-id');
                this.redownloadExport(recordId);
            } else if (e.target.classList.contains('history-delete')) {
                const recordId = e.target.getAttribute('data-id');
                this.deleteHistoryItem(recordId);
            }
        });
    }
    
    clearExportHistory() {
        if (confirm('Are you sure you want to clear all export history?')) {
            this.exporter.exportHistory = [];
            this.exporter.saveExportHistory();
            this.loadExportHistory();
            
            // Cleanup download URLs
            this.downloadUrls.forEach(downloadUrl => {
                downloadUrl.cleanup();
            });
            this.downloadUrls.clear();
            
            this.gamingInterface.announceToScreenReader('Export history cleared');
        }
    }
    
    // Utility methods
    createElement(tagName, attributes = {}) {
        const element = document.createElement(tagName);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key.startsWith('data-') || key.startsWith('aria-') || 
                       ['id', 'role', 'type', 'for'].includes(key)) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        
        return element;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    convertCsvToTable(csvData) {
        const lines = csvData.split('\n').slice(0, 10); // Show first 10 lines
        return lines.map((line, index) => {
            const cells = line.split(',');
            const tag = index === 0 ? 'th' : 'td';
            return `<tr>${cells.map(cell => `<${tag}>${this.escapeHtml(cell.replace(/"/g, ''))}</${tag}>`).join('')}</tr>`;
        }).join('');
    }
    
    // Stub methods for full implementation
    toggleBatchMode() { /* Batch mode implementation */ }
    cancelExport() { /* Export cancellation */ }
    updateExportOptions() { /* Options update */ }
    showExportModal(content) { /* Modal display */ }
    redownloadExport(recordId) { /* Re-download implementation */ }
    deleteHistoryItem(recordId) { /* History item deletion */ }
    loadExportPreferences() { /* Load saved preferences */ }
    saveExportPreferences() { /* Save user preferences */ }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiPlatformExportInterface;
} else if (typeof window !== 'undefined') {
    window.MultiPlatformExportInterface = MultiPlatformExportInterface;
}